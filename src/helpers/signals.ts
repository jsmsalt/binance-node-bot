import { PSAR, RSI, VWAP } from 'technicalindicators';
import { TrendAnalytics } from './utils';

export const GetPsarSignal = (low: number[], high: number[]): 'sell' | 'buy' | 'hold' => {
    let step = 0.02;
    let max = 0.2;
    let input = { high, low, step, max };
    let psarResults = PSAR.calculate(input);
    let [one, two, three] = psarResults.slice(-3);
    if (one >= two && two >= three) return 'hold';
    if (one <= two && two <= three) return 'hold';
    if (one >= two && two < three) return 'buy';
    if (one <= two && two > three) return 'sell';
    return 'hold';
};

export const GetRsiSignal = (
    close: number[],
    high: number = 70,
    low: number = 30,
    period: number = 14
): 'sell' | 'buy' | 'hold' => {
    let rsiResults = RSI.calculate({ values: close, period });
    let rsiTrend = TrendAnalytics(rsiResults.slice(-3), high, low);
    if (rsiTrend.isLow && !rsiTrend.isFalling) return 'buy';
    if (rsiTrend.isHigh && !rsiTrend.isRising) return 'sell';
    return 'hold';
};

export const GetVwapSignal = (
    close: number[],
    high: number[],
    low: number[],
    open: number[],
    volume: number[]
): 'sell' | 'buy' | 'hold' => {
    let vwap = VWAP.calculate({ close, high, low, volume });

    let [vw1, vw2] = vwap.slice(-2);
    let [o1, o2] = open.slice(-2);
    let [c1, c2] = close.slice(-2);

    if (c1 <= vw1 && c2 > vw2) return 'buy';
    if (o1 >= vw1 && o2 < vw2) return 'sell';

    return 'hold';
};
