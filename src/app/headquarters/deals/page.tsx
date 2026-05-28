"use client";

import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/deals/status-badge";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { BRANCH_MAP } from "@/lib/mock-db";

export default function HqDealsPage() {
  const { deals } = useAppStore();
  const [search, setSearch] = useState("");

  const filtered = deals.filter(
    (d) =>
      d.dealNo.includes(search) ||
      d.input.customerInfo.customerName.includes(search) ||
      (BRANCH_MAP[d.input.customerInfo.branchCode] ?? "").includes(search) ||
      d.input.customerInfo.branchCode.includes(search) ||
      search === ""
  );

  // 支店別集計
  const branchSummary = deals.reduce<Record<string, number>>((acc, d) => {
    const code = d.input.customerInfo.branchCode;
    acc[code] = (acc[code] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">案件一覧（全店）</h1>
        <p className="text-sm text-slate-400 mt-1">全営業店の案件一覧</p>
      </div>

      {/* 支店別件数サマリー */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(branchSummary).map(([code, count]) => (
          <button
            key={code}
            onClick={() => setSearch(code)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
            style={{
              background: search === code ? "rgba(0,200,255,0.15)" : "rgba(11,22,40,0.8)",
              border: search === code ? "1px solid rgba(0,200,255,0.4)" : "1px solid rgba(0,200,255,0.1)",
              color: search === code ? "#00c8ff" : "#94a3b8",
            }}
          >
            <span className="font-medium">{BRANCH_MAP[code] ?? `${code}店`}</span>
            <span className="rounded-full px-1.5 py-0.5 font-mono text-[10px]"
              style={{ background: "rgba(0,200,255,0.12)" }}>
              {count}件
            </span>
          </button>
        ))}
        {search && (
          <button onClick={() => setSearch("")}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            全店表示
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input placeholder="案件番号・取引先・支店名・店番で検索" className="pl-9"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyber-border/30 bg-cyber-surface/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">案件番号</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">支店</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">取引先名</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">ステータス</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">手数料額</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">更新日時</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((deal) => {
                  const code = deal.input.customerInfo.branchCode;
                  const branchName = BRANCH_MAP[code] ?? `${code}店`;
                  return (
                    <tr key={deal.dealId} className="border-b border-cyber-border/20 hover:bg-cyber-surface/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">{deal.dealNo}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-200">{branchName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{code}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">{deal.input.customerInfo.customerName}</td>
                      <td className="px-4 py-3"><StatusBadge status={deal.status} /></td>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {deal.result
                          ? new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(deal.result.prepaymentFee)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{formatDateTime(deal.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/headquarters/deals/${deal.dealId}/review`}>
                          <Button size="sm" variant="outline">詳細・承認</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">案件がありません</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
