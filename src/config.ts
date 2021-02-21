import dotenv from 'dotenv';
import { IConfig } from './types';
dotenv.config();

let { env } = process;

export const config: IConfig = {
    apiKey: env.BINANCE_KEY ?? '',
    apiSecret: env.BINANCE_SECRET ?? '',
    telegramToken: env.TELEGRAM_TOKEN ?? '',
    stopLoss: 2.5,
    minProfit: 0.03,
    // workersInterval: 1000,
    // bollingerBandsMinAvg: 0.6,
    // bollingerBandsPeriods: 20,
    candlesInterval: '1m',
    candlesLimit: 250,
    assets: [
        // { asset: 'DOGE', base: 'USDT', amount: 15 },
        // { asset: 'RVN', base: 'USDT', amount: 25 },
        // { asset: 'CAKE', base: 'USDT', amount: 25 },
        { asset: 'BNB', base: 'USDT', amount: 30 },
        { asset: 'UMA', base: 'USDT', amount: 30 },
        { asset: 'XRP', base: 'USDT', amount: 30 },
        { asset: 'AAVE', base: 'USDT', amount: 30 },
        { asset: 'VET', base: 'USDT', amount: 30 },
        { asset: 'DOT', base: 'USDT', amount: 30 },
        { asset: 'TRX', base: 'USDT', amount: 30 },
        { asset: 'ADA', base: 'USDT', amount: 30 },
        { asset: 'XLM', base: 'USDT', amount: 30 },
        { asset: 'NANO', base: 'USDT', amount: 30 },
        { asset: 'EOS', base: 'USDT', amount: 30 },
        { asset: 'LINK', base: 'USDT', amount: 30 },
        { asset: 'SC', base: 'USDT', amount: 30 },
        { asset: 'GRT', base: 'USDT', amount: 30 },
        { asset: 'ATOM', base: 'USDT', amount: 30 },
        { asset: 'UNI', base: 'USDT', amount: 30 },
        { asset: 'IOTA', base: 'USDT', amount: 30 },
        { asset: 'THETA', base: 'USDT', amount: 30 }
    ]
};
