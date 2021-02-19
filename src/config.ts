import dotenv from 'dotenv';
import { IConfig } from './types';
dotenv.config();

let { env } = process;

export const config: IConfig = {
    apiKey: env.BINANCE_KEY ?? '',
    apiSecret: env.BINANCE_SECRET ?? '',
    telegramToken: env.TELEGRAM_TOKEN ?? '',
    stopLoss: 5.0,
    minProfit: 0.1,
    workersInterval: 10000,
    // bollingerBandsMinAvg: 0.6,
    // bollingerBandsPeriods: 20,
    candlesInterval: '1m',
    candlesLimit: 250,
    assets: [
        // { asset: 'DOGE', base: 'USDT', amount: 15 },
        // { asset: 'UMA', base: 'USDT', amount: 25 },
        // { asset: 'XRP', base: 'USDT', amount: 25 },
        // { asset: 'AAVE', base: 'USDT', amount: 25 },
        { asset: 'VET', base: 'USDT', amount: 25 },
        { asset: 'DOT', base: 'USDT', amount: 25 },
        { asset: 'TRX', base: 'USDT', amount: 20 },
        { asset: 'ADA', base: 'USDT', amount: 15 },
        { asset: 'XLM', base: 'USDT', amount: 20 },
        { asset: 'NANO', base: 'USDT', amount: 15 },
        { asset: 'EOS', base: 'USDT', amount: 20 },
        { asset: 'LINK', base: 'USDT', amount: 20 },
        { asset: 'SC', base: 'USDT', amount: 25 },
        { asset: 'GRT', base: 'USDT', amount: 25 },
        { asset: 'ATOM', base: 'USDT', amount: 35 },
        { asset: 'UNI', base: 'USDT', amount: 15 },
        { asset: 'IOTA', base: 'USDT', amount: 35 },
        { asset: 'THETA', base: 'USDT', amount: 35 }
    ]
};
