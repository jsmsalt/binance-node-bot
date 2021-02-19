import Binance, { CandleChartInterval } from 'binance-api-node';
import { CandleToObjectArray } from './helpers/utils';
import { config } from './config';
import { GetPsarSignal, GetRsiSignal, GetVwapSignal } from './helpers/signals';
import { EMA } from 'technicalindicators';

console.log('**** PLAYGROUND ****');

const client = Binance({ apiKey: config.apiKey, apiSecret: config.apiSecret });

(async () => {
    for (let s = 0; s < config.assets.length; s++) {
        const symbol = config.assets[s];

        let candles = await client.candles({
            symbol: `${symbol.asset}${symbol.base}`,
            interval: config.candlesInterval as CandleChartInterval,
            limit: 1000
        });

        let { low, high, close, open, volume } = CandleToObjectArray(candles);

        let mode: 'buy' | 'sell' = 'buy';
        let assetBalance = 0;
        let baseBalance = 100;
        let lastPrice = 0;
        let lastBuyPrice = 0;

        let closePeriod = close.slice(0, low.length - 100);

        for (let i = 0; i < closePeriod.length; i++) {
            let price = closePeriod[i];

            let l = low.slice(i, i + 100);
            let h = high.slice(i, i + 100);
            let c = close.slice(i, i + 100);
            let o = open.slice(i, i + 100);
            let v = volume.slice(i, i + 100);

            let signalRsi = GetRsiSignal(c);
            let signalPsar = GetPsarSignal(l, h, c);
            let signalVwap = GetVwapSignal(c, h, l, o, v);

            if (mode === 'buy') {
                if (signalPsar === 'buy') {
                    //   let candlesHour = await client.candles({
                    //       symbol: `${symbol.asset}${symbol.base}`,
                    //       interval: CandleChartInterval.ONE_HOUR,
                    //       limit: 250
                    //   });

                    //   let { close: closeHour } = CandleToObjectArray(candlesHour);

                    //   let ema200 = EMA.calculate({values: closeHour,period: 200});

                    //   ema200 = ema200.slice(-10);
                    //   let percentaje = (ema200[ema200.length - 1] * 100) / ema200[0] - 100;

                    assetBalance = baseBalance / price;
                    baseBalance = 0;
                    mode = 'sell';
                    lastBuyPrice = price;
                }
            } else {
                if (signalPsar === 'sell' && price > lastBuyPrice) {
                    baseBalance = assetBalance * price;
                    assetBalance = 0;
                    mode = 'buy';
                }
            }

            if (i === closePeriod.length - 1) lastPrice = price;
        }

        let finalBalance = baseBalance > 0 ? baseBalance : assetBalance * lastPrice;
        console.log(`asset name: ${symbol.asset}, amount: ${finalBalance}`);
    }
})();