import { YieldCurve } from "@/types/market-data";

/**
 * デモ用モック市場データ
 * 固定ローン締結時（数年前）より現在の市場金利が低下している状況を想定
 * → 再運用レート < 約定金利 となり、期限前弁済手数料が発生するシナリオ
 */

export const MOCK_L_SHIKIRI_CURVE: YieldCurve = {
  curveType: "L_SHIKIRI",
  side: "BID",
  baseDate: "2026-05-28",
  acquiredAt: new Date().toISOString(),
  points: [
    { tenor: "1M",   tenorYears: 0.0833, rate: 0.10 },
    { tenor: "2M",   tenorYears: 0.1667, rate: 0.11 },
    { tenor: "3M",   tenorYears: 0.25,   rate: 0.12 },
    { tenor: "6M",   tenorYears: 0.5,    rate: 0.15 },
    { tenor: "9M",   tenorYears: 0.75,   rate: 0.18 },
    { tenor: "1Y",   tenorYears: 1.0,    rate: 0.20 },
    { tenor: "1.5Y", tenorYears: 1.5,    rate: 0.28 },
    { tenor: "2Y",   tenorYears: 2.0,    rate: 0.38 },
    { tenor: "3Y",   tenorYears: 3.0,    rate: 0.52 },
    { tenor: "4Y",   tenorYears: 4.0,    rate: 0.65 },
    { tenor: "5Y",   tenorYears: 5.0,    rate: 0.78 },
    { tenor: "6Y",   tenorYears: 6.0,    rate: 0.88 },
    { tenor: "7Y",   tenorYears: 7.0,    rate: 0.96 },
    { tenor: "8Y",   tenorYears: 8.0,    rate: 1.02 },
    { tenor: "9Y",   tenorYears: 9.0,    rate: 1.08 },
    { tenor: "10Y",  tenorYears: 10.0,   rate: 1.12 },
  ],
};

export const MOCK_TIBOR_SWAP_CURVE: YieldCurve = {
  curveType: "TIBOR_SWAP",
  side: "BID",
  baseDate: "2026-05-28",
  acquiredAt: new Date().toISOString(),
  points: [
    { tenor: "1M",  tenorYears: 0.0833, rate: 0.12 },
    { tenor: "3M",  tenorYears: 0.25,   rate: 0.18 },
    { tenor: "6M",  tenorYears: 0.5,    rate: 0.22 },
    { tenor: "1Y",  tenorYears: 1.0,    rate: 0.28 },
    { tenor: "2Y",  tenorYears: 2.0,    rate: 0.42 },
    { tenor: "3Y",  tenorYears: 3.0,    rate: 0.55 },
    { tenor: "5Y",  tenorYears: 5.0,    rate: 0.75 },
    { tenor: "7Y",  tenorYears: 7.0,    rate: 0.92 },
    { tenor: "10Y", tenorYears: 10.0,   rate: 1.10 },
  ],
};
