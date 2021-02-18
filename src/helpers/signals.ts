import { PSAR, RSI } from 'technicalindicators';
import { TrendAnalytics } from './utils';

export const GetPsarSignal = (low: number[], high: number[]): 'sell' | 'buy' | 'hold' => {
    let step = 0.02;
    let max = 0.2;
    let input = { high, low, step, max };
    let psar = new PSAR(input);
    let psarResults = psar.getResult() as number[];

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
    let rsi = new RSI({ values: close, period: period });
    let rsiResults = rsi.getResult() as number[];
    let rsiTrend = TrendAnalytics(rsiResults.slice(-3), high, low);

    if (rsiTrend.isLow && !rsiTrend.isFalling) return 'buy';

    if (rsiTrend.isHigh && !rsiTrend.isRising) return 'sell';

    return 'hold';
};
