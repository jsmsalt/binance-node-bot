export interface IOHLCV {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
}

export interface IAsset {
    asset: string;
    base: string;
    amount: number;
}

export interface IConfig {
    apiKey: string;
    apiSecret: string;
    telegramToken: string;
    stopLoss: number;
    minProfit: number;
    workersInterval: number;
    bollingerBandsPeriods?: number;
    bollingerBandsMinAvg?: number;
    candlesLimit: number;
    candlesInterval:
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
        | '1M';
    assets: IAsset[];
}
