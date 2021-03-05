import dotenv from 'dotenv';
import { IConfig } from './types';
dotenv.config();

let { env } = process;

export const config: IConfig = {
    apiKey: env.BINANCE_KEY ?? '',
    apiSecret: env.BINANCE_SECRET ?? '',
    telegramToken: env.TELEGRAM_TOKEN ?? '',
    stopLoss: 5,
    minProfit: 0.05,
    // workersInterval: 1000,
    // bollingerBandsMinAvg: 0.6,
    // bollingerBandsPeriods: 20,
    candlesInterval: '1m',
    candlesLimit: 250,
    assets: [
        // { asset: 'DOGE', base: 'USDT', amount: 20 },
        { asset: 'AAVE', base: 'USDT', amount: 20 },
        { asset: 'ADA', base: 'USDT', amount: 20 },
        { asset: 'ALGO', base: 'USDT', amount: 20 },
        { asset: 'ATOM', base: 'USDT', amount: 20 },
        { asset: 'BAT', base: 'USDT', amount: 20 },
        { asset: 'BNB', base: 'USDT', amount: 20 },
        { asset: 'BNT', base: 'USDT', amount: 20 },
        { asset: 'CAKE', base: 'USDT', amount: 20 },
        { asset: 'DODO', base: 'USDT', amount: 20 },
        { asset: 'DOT', base: 'USDT', amount: 20 },
        { asset: 'ENJ', base: 'USDT', amount: 20 },
        { asset: 'EOS', base: 'USDT', amount: 20 },
        { asset: 'ETH', base: 'USDT', amount: 20 },
        { asset: 'FIL', base: 'USDT', amount: 20 },
        { asset: 'GRT', base: 'USDT', amount: 20 },
        { asset: 'ICX', base: 'USDT', amount: 20 },
        { asset: 'IOTA', base: 'USDT', amount: 20 },
        { asset: 'LINK', base: 'USDT', amount: 20 },
        { asset: 'LIT', base: 'USDT', amount: 20 },
        { asset: 'LUNA', base: 'USDT', amount: 20 },
        { asset: 'MANA', base: 'USDT', amount: 20 },
        { asset: 'NANO', base: 'USDT', amount: 20 },
        { asset: 'ONT', base: 'USDT', amount: 20 },
        { asset: 'RUNE', base: 'USDT', amount: 20 },
        { asset: 'RVN', base: 'USDT', amount: 20 },
        { asset: 'SC', base: 'USDT', amount: 20 },
        { asset: 'SOL', base: 'USDT', amount: 20 },
        { asset: 'THETA', base: 'USDT', amount: 20 },
        { asset: 'TRX', base: 'USDT', amount: 20 },
        { asset: 'UMA', base: 'USDT', amount: 20 },
        { asset: 'UNI', base: 'USDT', amount: 20 },
        { asset: 'VET', base: 'USDT', amount: 20 },
        { asset: 'XLM', base: 'USDT', amount: 20 },
        { asset: 'XRP', base: 'USDT', amount: 20 },
        { asset: 'ZIL', base: 'USDT', amount: 20 },
        { asset: 'ZRX', base: 'USDT', amount: 20 }
    ]
};
