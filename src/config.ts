import dotenv from 'dotenv';
import { IConfig } from 'types';
dotenv.config();

let { env } = process;

export const config: IConfig = {
    apiKey: env.BINANCE_KEY ?? '',
    apiSecret: env.BINANCE_SECRET ?? '',
    telegramToken: env.TELEGRAM_TOKEN ?? '',
    stopLoss: 3.0,
    minProfit: 0.2,
    workersInterval: 30000,
    bollingerBandsMinAvg: 0.6,
    bollingerBandsPeriods: 20,
    candlesInterval: '15m',
    candlesLimit: 100,
    assets: [
        { asset: 'DOGE', base: 'USDT', amount: 25 },
        { asset: 'VET', base: 'USDT', amount: 25 },
        { asset: 'DOT', base: 'USDT', amount: 25 },
        { asset: 'UMA', base: 'USDT', amount: 25 },
        { asset: 'TRX', base: 'USDT', amount: 25 },
        { asset: 'XRP', base: 'USDT', amount: 25 },
        { asset: 'ADA', base: 'USDT', amount: 25 },
        { asset: 'XLM', base: 'USDT', amount: 25 },
        { asset: 'NANO', base: 'USDT', amount: 25 },
        { asset: 'EOS', base: 'USDT', amount: 25 },
        { asset: 'LINK', base: 'USDT', amount: 25 },
        { asset: 'SC', base: 'USDT', amount: 25 },
        { asset: 'GRT', base: 'USDT', amount: 25 },
        { asset: 'AAVE', base: 'USDT', amount: 25 },
        { asset: 'ATOM', base: 'USDT', amount: 25 },
        { asset: 'UNI', base: 'USDT', amount: 25 },
        { asset: 'IOTA', base: 'USDT', amount: 25 },
        { asset: 'THETA', base: 'USDT', amount: 25 }
    ]
};
