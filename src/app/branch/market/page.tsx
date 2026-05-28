"use client";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { MOCK_TIBOR_SWAP_CURVE, MOCK_TONA_CURVE } from "@/lib/mock-market-data";
import { formatDateTime } from "@/lib/format";
import { YieldCurvePoint } from "@/types/market-data";
import { Activity, TrendingUp, Info, Table2, BarChart2 } from "lucide-react";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// データ結合（等間隔カテゴリ軸用）
// ─────────────────────────────────────────────────────────────
function buildChartData() {
  const map = new Map<number, { tenor: string; tenorYears: number; yieldCurve?: number; tona?: number }>();
  MOCK_TIBOR_SWAP_CURVE.points.forEach((p) =>
    map.set(p.tenorYears, { tenor: p.tenor, tenorYears: p.tenorYears, yieldCurve: p.rate })
  );
  MOCK_TONA_CURVE.points.forEach((p) => {
    const ex = map.get(p.tenorYears);
    if (ex) ex.tona = p.rate;
    else map.set(p.tenorYears, { tenor: p.tenor, tenorYears: p.tenorYears, tona: p.rate });
  });
  return Array.from(map.values()).sort((a, b) => a.tenorYears - b.tenorYears);
}

const CHART_DATA = buildChartData();
const CONTRACT_RATE = 1.52091;
const REMAINING_YEARS = 3.068;

// ─────────────────────────────────────────────────────────────
// カスタムツールチップ
// ─────────────────────────────────────────────────────────────
interface TooltipEntry { dataKey: string; value?: number; color: string; }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipEntry[] }) {
  if (!active || !payload?.length) return null;
  // tenor ラベルを dataKey と value からチャートデータ逆引き
  const tenorLabel = (() => {
    for (const entry of payload) {
      if (entry.value === undefined) continue;
      const pt = CHART_DATA.find((d) =>
        entry.dataKey === "yieldCurve" ? d.yieldCurve === entry.value : d.tona === entry.value
      );
      if (pt) return pt.tenor;
    }
    return "";
  })();

  return (
    <div className="rounded-lg px-4 py-3 text-xs"
      style={{ background: "rgba(8,15,30,0.97)", border: "1px solid rgba(0,200,255,0.28)", boxShadow: "0 0 16px rgba(0,200,255,0.12)" }}>
      <p className="font-semibold text-slate-200 mb-2">Tenor: {tenorLabel}</p>
      {([
        { key: "yieldCurve", label: "イールドカーブ（円金利スワップ）", color: "#00c8ff" },
        { key: "tona",       label: "TONA-OIS",                         color: "#a78bfa" },
      ] as const).map(({ key, label, color }) => {
        const e = payload.find((p) => p.dataKey === key);
        if (!e || e.value === undefined) return null;
        return (
          <p key={key} className="flex items-center gap-2 mb-0.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
            <span className="text-slate-400">{label}:</span>
            <span className="font-mono font-semibold" style={{ color }}>{e.value.toFixed(5)}%</span>
          </p>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// テーブルコンポーネント
// ─────────────────────────────────────────────────────────────
function CurveTable({ title, points, accentColor = "#00c8ff" }:
  { title: string; points: YieldCurvePoint[]; accentColor?: string }) {
  const max = Math.max(...points.map((p) => p.rate));
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">{title}</h3>
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(11,22,40,0.80)", border: "1px solid rgba(0,200,255,0.12)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(0,200,255,0.08)" }}>
              <th className="text-left px-4 py-2 text-slate-500 text-[10px] uppercase tracking-wider">Tenor</th>
              <th className="text-right px-4 py-2 text-slate-500 text-[10px] uppercase tracking-wider">年数</th>
              <th className="text-right px-4 py-2 text-slate-500 text-[10px] uppercase tracking-wider">Rate (%)</th>
              <th className="px-4 py-2 hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody>
            {points.map((pt, i) => (
              <tr key={pt.tenor} className="hover:bg-white/[0.03] transition-colors"
                style={{ borderBottom: i < points.length - 1 ? "1px solid rgba(0,200,255,0.06)" : undefined }}>
                <td className="px-4 py-2 text-slate-200 text-xs font-medium">{pt.tenor}</td>
                <td className="px-4 py-2 text-right font-mono text-slate-500 text-[11px]">{pt.tenorYears.toFixed(4)}</td>
                <td className="px-4 py-2 text-right font-mono text-xs font-semibold" style={{ color: accentColor }}>
                  {pt.rate.toFixed(5)}
                </td>
                <td className="px-4 py-2 hidden sm:table-cell">
                  <div className="h-1.5 rounded-full"
                    style={{ width: `${Math.round((pt.rate / max) * 100)}px`, background: `linear-gradient(90deg, ${accentColor}77, ${accentColor}bb)` }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ページ本体
// ─────────────────────────────────────────────────────────────
export default function MarketDataPage() {
  const [view, setView] = useState<"chart" | "table">("chart");
  const acquiredAt = MOCK_TIBOR_SWAP_CURVE.acquiredAt;

  // TONA ON レートをヘッダーに表示
  const tonaOn = MOCK_TONA_CURVE.points[0].rate;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-cyber-cyan" />
            <h1 className="text-2xl font-bold text-slate-100">市場データ確認</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 ml-9">
            取得日時：<span className="font-mono text-slate-400">{formatDateTime(acquiredAt)}</span>
            &nbsp;|&nbsp;Base Date：<span className="font-mono text-slate-400">{MOCK_TIBOR_SWAP_CURVE.baseDate}</span>
          </p>
        </div>

        {/* サマリーチップ */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="rounded-lg px-3 py-2 text-center" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.22)" }}>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">TONA (ON)</p>
            <p className="font-mono text-base font-bold" style={{ color: "#a78bfa" }}>{tonaOn.toFixed(2)}%</p>
          </div>
          {/* グラフ/テーブル切替 */}
          <div className="flex items-center rounded-lg p-0.5" style={{ background: "rgba(11,22,40,0.9)", border: "1px solid rgba(0,200,255,0.15)" }}>
            {(["chart", "table"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150"
                style={view === v
                  ? { background: "rgba(0,200,255,0.15)", color: "#00c8ff", boxShadow: "0 0 8px rgba(0,200,255,0.2)" }
                  : { color: "#64748b" }}>
                {v === "chart" ? <BarChart2 className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
                {v === "chart" ? "グラフ" : "テーブル"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* グラフ */}
      {view === "chart" && (
        <div className="rounded-xl p-6" style={{ background: "rgba(11,22,40,0.85)", border: "1px solid rgba(0,200,255,0.12)" }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-cyber-cyan" />
            <h2 className="text-sm font-semibold text-slate-200">イールドカーブ / TONA-OIS カーブ</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-6 ml-6">
            全テナー等間隔 ／ 円金利スワップ（イールドカーブ）vs TONA-OIS — Rate (%)
          </p>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={CHART_DATA} margin={{ top: 16, right: 32, left: 0, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,200,255,0.06)" />
              <XAxis dataKey="tenor" type="category"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={{ stroke: "rgba(0,200,255,0.1)" }}
                tickLine={{ stroke: "rgba(0,200,255,0.08)" }}
                angle={-35} textAnchor="end" height={50} interval={0} />
              <YAxis domain={[0, 1.6]} tickFormatter={(v: number) => `${v.toFixed(2)}%`}
                tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 4 }}
                formatter={(v: string) => v === "yieldCurve" ? "イールドカーブ（円金利スワップ）" : "TONA-OIS"} />

              {/* 約定金利ライン */}
              <ReferenceLine y={CONTRACT_RATE} stroke="rgba(251,191,36,0.7)" strokeDasharray="6 4" strokeWidth={1.5}
                label={{ value: `約定金利 ${CONTRACT_RATE}%`, position: "insideTopRight", fill: "#fbbf24", fontSize: 10, dy: -6 }} />

              {/* 残存年数ライン（3Y付近） */}
              <ReferenceLine x="3Y" stroke="rgba(255,255,255,0.18)" strokeDasharray="4 4" strokeWidth={1}
                label={{ value: `残存≈${REMAINING_YEARS}Y`, position: "insideTopRight", fill: "#94a3b8", fontSize: 9, dy: -20 }} />

              <Line type="monotone" dataKey="yieldCurve" name="yieldCurve" stroke="#00c8ff" strokeWidth={2.5}
                dot={{ fill: "#00c8ff", r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#00c8ff", strokeWidth: 0 }} connectNulls />
              <Line type="monotone" dataKey="tona" name="tona" stroke="#a78bfa" strokeWidth={2.5}
                strokeDasharray="6 3"
                dot={{ fill: "#a78bfa", r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#a78bfa", strokeWidth: 0 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>

          {/* 凡例補足 */}
          <div className="flex flex-wrap gap-5 mt-2 ml-14 text-[11px] text-slate-500">
            <span className="flex items-center gap-2">
              <span className="inline-block w-7 h-0" style={{ borderTop: "2px dashed rgba(251,191,36,0.65)" }} />
              約定金利 {CONTRACT_RATE}%
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-7 h-0" style={{ borderTop: "2px dashed rgba(255,255,255,0.2)" }} />
              残存年数参考ライン
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-7 h-0" style={{ borderTop: "2.5px dashed #a78bfa" }} />
              TONA-OIS（破線）
            </span>
          </div>
        </div>
      )}

      {/* テーブル */}
      {view === "table" && (
        <div className="flex flex-col lg:flex-row gap-4">
          <CurveTable title="イールドカーブ（円金利スワップ Bid）" points={MOCK_TIBOR_SWAP_CURVE.points} accentColor="#00c8ff" />
          <CurveTable title="TONA-OIS カーブ（Mid）" points={MOCK_TONA_CURVE.points} accentColor="#a78bfa" />
        </div>
      )}

      {/* 参考情報カード */}
      <div className="rounded-xl p-5" style={{ background: "rgba(11,22,40,0.80)", border: "1px solid rgba(0,200,255,0.15)" }}>
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-cyber-cyan shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">カーブ概要</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="space-y-1.5">
                <p className="font-semibold text-cyber-cyan text-[11px] uppercase tracking-wider">イールドカーブ（円金利スワップ）</p>
                <p>TIBOR を参照金利とする円金利スワップの Bid レートを表示しています。固定金利融資の再運用レート算出に使用します。テナーは 1M〜10Y の 9 点です。</p>
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-[11px] uppercase tracking-wider" style={{ color: "#a78bfa" }}>TONA-OIS カーブ</p>
                <p>TONA（無担保コール翌日物加重平均レート）を参照金利とする OIS（Overnight Index Swap）のカーブです。日本のリスクフリーレート（RFR）として LIBOR 移行後の基準レートとなっています。現在 ON は {tonaOn.toFixed(2)}% です。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
