import dotenv from 'dotenv';
import { IConfig } from './types';
dotenv.config();

let { env } = process;

export const config: IConfig = {
    apiKey: env.BINANCE_KEY ?? '',
    apiSecret: env.BINANCE_SECRET ?? '',
    telegramToken: env.TELEGRAM_TOKEN ?? '',
    stopLoss: 2.25,
    minProfit: 0.025,
    // workersInterval: 1000,
    // bollingerBandsMinAvg: 0.6,
    // bollingerBandsPeriods: 20,
    candlesInterval: '1m',
    candlesLimit: 250,
    assets: [
        // { asset: 'DOGE', base: 'USDT', amount: 40 },
        { asset: 'AAVE', base: 'USDT', amount: 40 },
        { asset: 'ADA', base: 'USDT', amount: 40 },
        { asset: 'ALGO', base: 'USDT', amount: 40 },
        { asset: 'ATOM', base: 'USDT', amount: 40 },
        { asset: 'BAT', base: 'USDT', amount: 40 },
        { asset: 'BNB', base: 'USDT', amount: 40 },
        { asset: 'BNT', base: 'USDT', amount: 40 },
        { asset: 'CAKE', base: 'USDT', amount: 40 },
        { asset: 'DOT', base: 'USDT', amount: 40 },
        { asset: 'EOS', base: 'USDT', amount: 40 },
        { asset: 'FIL', base: 'USDT', amount: 40 },
        { asset: 'GRT', base: 'USDT', amount: 40 },
        { asset: 'ICX', base: 'USDT', amount: 40 },
        { asset: 'IOTA', base: 'USDT', amount: 40 },
        { asset: 'LINK', base: 'USDT', amount: 40 },
        { asset: 'LUNA', base: 'USDT', amount: 40 },
        { asset: 'MANA', base: 'USDT', amount: 40 },
        { asset: 'NANO', base: 'USDT', amount: 40 },
        { asset: 'ONT', base: 'USDT', amount: 40 },
        { asset: 'RUNE', base: 'USDT', amount: 40 },
        { asset: 'RVN', base: 'USDT', amount: 40 },
        { asset: 'SC', base: 'USDT', amount: 40 },
        { asset: 'THETA', base: 'USDT', amount: 40 },
        { asset: 'TRX', base: 'USDT', amount: 40 },
        { asset: 'UMA', base: 'USDT', amount: 40 },
        { asset: 'UNI', base: 'USDT', amount: 40 },
        { asset: 'VET', base: 'USDT', amount: 40 },
        { asset: 'XLM', base: 'USDT', amount: 40 },
        { asset: 'XRP', base: 'USDT', amount: 40 },
        { asset: 'ZIL', base: 'USDT', amount: 40 },
        { asset: 'ZRX', base: 'USDT', amount: 40 }
    ]
};
