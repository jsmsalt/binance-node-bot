import Binance, { AssetBalance, CandleChartInterval, CandleChartResult } from 'binance-api-node';
import { config } from './config';
import { exit } from 'process';
import { parentPort, workerData } from 'worker_threads';
import { CandleToObjectArray, RoundStep } from './helpers/utils';
import { GetPsarSignal } from './helpers/signals';
import { IAsset } from './types';
import { EMA } from 'technicalindicators';

let { asset, base, amount } = workerData as IAsset;

const client = Binance({ apiKey: config.apiKey, apiSecret: config.apiSecret });

(async () => {
    /*
     *   UTILS
     */
    const Log = (msg: string, sendToTelegram: boolean = false) => {
        let datetime = new Date().toLocaleString();
        console.log(`[${datetime}][${asset}] ${msg}`);
        if (sendToTelegram) parentPort.postMessage(`[${asset}] ${msg}`);
        return;
    };

    const GetPrice = async (): Promise<number> => {
        try {
            return Number.parseFloat(Object.values(await client.prices({ symbol: `${asset}${base}` }))[0]);
        } catch (error) {
            return 0;
        }
    };

    const GetLastBuyPrice = async (): Promise<string> => {
        try {
            let myTrades = await client.myTrades({ symbol: `${asset}${base}` });
            myTrades = myTrades.filter(x => x.isBuyer);
            let lastBuyOrder = myTrades[myTrades.length - 1];
            return lastBuyOrder.price;
        } catch (error) {
            return null;
        }
    };

    const SymbolIsRising = async (): Promise<boolean> => {
        let candlesHour = await client.candles({
            symbol: `${asset}${base}`,
            interval: CandleChartInterval.ONE_HOUR,
            limit: 250
        });

        let { close: closeHour } = CandleToObjectArray(candlesHour);
        let ema200 = EMA.calculate({ values: closeHour, period: 200 });

        let emaLast20 = ema200.slice(-20);
        let emaLast10 = emaLast20.slice(-10);

        let emaLast20Percent = (emaLast20[emaLast20.length - 1] * 100) / emaLast20[0] - 100;
        let emaLast10Percent = (emaLast10[emaLast10.length - 1] * 100) / emaLast10[0] - 100;

        return emaLast20Percent > 0.8 && emaLast10Percent > 0.5;
    };

    const GetNextCandleTime = (
        time: number,
        period:
            | '1m'
            | '3m'
            | '5m'
            | '15m'
            | '30m'
            | '1h'
            | '2h'
            | '4h'
            | '6h'
            | '8h'
            | '12h'
            | '1d'
            | '3d'
            | '1w'
            | '1M'
    ) => {
        const SECOND = 1000;
        const MINUTE = SECOND * 60;
        const HOUR = MINUTE * 60;
        const DAY = HOUR * 24;
        const WEEK = DAY * 7;
        const MONTH = DAY * 24;

        const periods = {
            '1m': MINUTE,
            '3m': MINUTE * 3,
            '5m': MINUTE * 5,
            '15m': MINUTE * 15,
            '30m': MINUTE * 30,
            '1h': HOUR,
            '2h': HOUR * 2,
            '4h': HOUR * 4,
            '6h': HOUR * 6,
            '8h': HOUR * 8,
            '12h': HOUR * 12,
            '1d': DAY,
            '3d': DAY * 3,
            '1w': WEEK,
            '1M': MONTH
        };

        return time + periods[period] + SECOND;
    };

    /*
     *   SYMBOL DATA
     */
    let tickSize: string;
    let minQty: number;

    try {
        let exchangeInfo = await client.exchangeInfo();
        let filters = exchangeInfo.symbols.find(x => x.symbol === `${asset}${base}`).filters;
        let qty = filters.find(x => x.filterType === 'LOT_SIZE');
        tickSize = qty['stepSize'];
        minQty = Number.parseFloat(qty['minQty']);
    } catch (error) {
        Log(`Error al obtener información`, true);
        exit(1);
    }

    /*
     *   DEFAULT VALUES
     */
    // let lastOpenTime: number = 0;
    let nextCandleTime: number = 0;
    let candles: CandleChartResult[] = [];

    Log('Worker iniciado...');

    setInterval(async () => {
        if (nextCandleTime && nextCandleTime < new Date().getTime()) return;

        // let currentOpenTime: number = 0;

        try {
            /*
             *   ASSET CANDLES
             */

            try {
                candles = await client.candles({
                    symbol: `${asset}${base}`,
                    interval: config.candlesInterval as CandleChartInterval,
                    limit: config.candlesLimit
                });

                let { openTime } = candles[candles.length - 1];
                nextCandleTime = GetNextCandleTime(openTime, config.candlesInterval);
                Log('Velas cargadas');
                // currentOpenTime = openTime;
                // console.log(currentOpenTime);
                // console.log(new Date().getTime());
                // console.log(new Date().getTime() - currentOpenTime);
                // if (currentOpenTime === lastOpenTime) return;
            } catch (error) {
                return Log('Error al leer velas');
            }

            let { low, high, close } = CandleToObjectArray(candles);
            let signalPsar = GetPsarSignal(low, high, close);
            if (signalPsar === 'hold') {
                // lastOpenTime = currentOpenTime;
                return;
            }

            /*
             *   OPEN ORDERS
             */
            try {
                let orders = await client.openOrders({ symbol: `${asset}${base}` });
                orders = orders.filter(x => x.type === 'MARKET');
                if (orders.length > 0) return Log('Hay ordenes abiertas');
                // Log('No hay ordenes abiertas');
            } catch (error) {
                return Log('Error al leer ordenes');
            }

            /*
             *   BALANCES
             */
            let balances: AssetBalance[];

            try {
                let { balances: binanceBalances } = await client.accountInfo();
                balances = binanceBalances;
            } catch (error) {
                return Log('Error al leer balances');
            }

            let { free: assetBalance, locked: assetLockedBalance } = balances.find(x => x.asset === asset);
            let { free: baseBalance } = balances.find(x => x.asset === base);

            // lastOpenTime = currentOpenTime;

            if (Number.parseFloat(assetBalance) < minQty) {
                /*
                 *   BUY
                 */
                if (signalPsar !== 'buy') return Log('No hay señal de compra');
                Log('Señal de compra');
                if (Number.parseFloat(assetLockedBalance) >= minQty) return Log('Balance bloqueado');
                if (Number.parseFloat(baseBalance) < amount)
                    return Log('El monto disponible no es suficiente para comprar');

                let isRising = await SymbolIsRising();
                if (!isRising) return Log(`El mercado no está estable para comprar`);

                // let bbAverage = GetAvgBollingerBands(close, config.bollingerBandsPeriods);
                // if (bbAverage < config.bollingerBandsMinAvg)
                //     return Log(`El mercado no está estable para comprar (avg BB: ${bbAverage.toFixed(2)})`);

                let price = await GetPrice();
                if (!price) return;

                let qty = RoundStep(amount / price, tickSize);

                if (Number.parseFloat(qty) < minQty) {
                    return Log(
                        `No alcanza para comprar el monto minimo (min: ${minQty}, qty: ${qty}, amount: ${amount}, price: ${price})`
                    );
                }

                try {
                    await client.order({ symbol: `${asset}${base}`, type: 'MARKET', side: 'BUY', quantity: qty });
                    Log(`Compré en ${price}`, true);
                } catch (error) {
                    return Log('Error al comprar');
                }
            } else {
                /*
                 *   SELL
                 */
                if (signalPsar !== 'sell') return Log('No hay señal de venta');
                Log('Señal de venta');
                let lastBuyPrice = await GetLastBuyPrice();
                if (!lastBuyPrice) return;

                let price = await GetPrice();
                if (!price) return;

                let percentage = Number.parseFloat(((price * 100) / Number.parseFloat(lastBuyPrice) - 100).toFixed(4));

                let ifReachMinProfit = percentage >= config.minProfit;
                let ifReachStopLoss = percentage <= 0 && config.stopLoss > 0 && Math.abs(percentage) >= config.stopLoss;

                if (ifReachMinProfit || ifReachStopLoss) {
                    let qty = RoundStep(assetBalance, tickSize);

                    try {
                        await client.order({
                            symbol: `${asset}${base}`,
                            type: 'MARKET',
                            side: 'SELL',
                            quantity: qty
                        });

                        Log(`Vendí en ${price}, con una ganancia de ${percentage.toFixed(2)}%`, true);
                    } catch (error) {
                        return Log('Error al vender', true);
                    }
                } else {
                    return Log(`No se cumplen las condiciones para vender (${percentage.toFixed(2)}%)`);
                }
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            return Log(`Error inesperado`, true);
        }
    }, 2000);
})();
