import { CandleChartResult } from 'binance-api-node';
import { BollingerBands } from 'technicalindicators';
import { IOHLCV } from 'types';

export const TrendAnalytics = (values: number[], highThreshold: number, lowThreshold: number) => {
    let last = values[values.length - 1];

    let isHigh = last > highThreshold;
    let isLow = last < lowThreshold;

    let highDiff = Math.floor(Math.abs((last * 100) / highThreshold - 100));
    let lowDiff = Math.floor(Math.abs((last * 100) / lowThreshold - 100));

    let isFalling = true;
    for (var i = 0, l = values.length - 1; i < l; i++) {
        isFalling = isFalling && values[i] > values[i + 1];
    }

    let isRising = true;
    for (var i = 0, l = values.length - 1; i < l; i++) {
        isRising = isRising && values[i] < values[i + 1];
    }

    return { isHigh, isLow, isRising, isFalling, highDiff, lowDiff };
};

export const CandleToObjectArray = (candles: CandleChartResult[]) => {
    let candleObject: IOHLCV = {
        open: [],
        high: [],
        low: [],
        close: [],
        volume: []
    };

    for (let i = 0; i < candles.length; i++) {
        candleObject.open.push(Number.parseFloat(candles[i].open));
        candleObject.high.push(Number.parseFloat(candles[i].high));
        candleObject.low.push(Number.parseFloat(candles[i].low));
        candleObject.close.push(Number.parseFloat(candles[i].close));
        candleObject.volume.push(Number.parseFloat(candles[i].volume));
    }

    return candleObject;
};

export const GetAvgBollingerBands = (close: number[], avgMinutes: number): number => {
    let bollingerBands = BollingerBands.calculate({ period: 20, stdDev: 2, values: close });
    return (
        bollingerBands
            .slice(-avgMinutes)
            .map(x => x.pb)
            .reduce((a, b) => a + b) / avgMinutes
    );
};

export const RoundStep = (value: number | string, step: number | string): string => {
    let valueNum = typeof value === 'number' ? value : Number.parseFloat(value);
    let stepNum = typeof step === 'number' ? step : Number.parseFloat(step);
    let positions = Math.round(Math.log(1 / stepNum) / Math.log(10));
    return (Math.trunc(valueNum / stepNum) * stepNum).toFixed(positions);
};
