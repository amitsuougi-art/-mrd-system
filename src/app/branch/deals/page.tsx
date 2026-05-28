"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/deals/status-badge";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { BRANCH_MAP } from "@/lib/mock-db";

const STATIC_DEAL_IDS = new Set(["deal-001", "deal-002", "deal-003", "deal-004", "deal-005"]);

export default function BranchDealsPage() {
  const router = useRouter();
  const { deals, setActiveDealId } = useAppStore();
  const [search, setSearch] = useState("");

  const filtered = deals.filter(
    (d) =>
      d.dealNo.includes(search) ||
      d.input.customerInfo.customerName.includes(search) ||
      (BRANCH_MAP[d.input.customerInfo.branchCode] ?? "").includes(search) ||
      search === ""
  );

  const navigateToDeal = (dealId: string) => {
    if (STATIC_DEAL_IDS.has(dealId)) {
      router.push(`/branch/deals/${dealId}/result`);
    } else {
      setActiveDealId(dealId);
      router.push("/branch/deals/result");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">案件一覧</h1>
          <p className="text-sm text-slate-400 mt-1">自店の案件一覧</p>
        </div>
        <Link href="/branch/deals/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />新規案件登録
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input placeholder="案件番号・取引先・支店で検索" className="pl-9"
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">作成日時</th>
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
                          : "―"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{formatDateTime(deal.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => navigateToDeal(deal.dealId)}>詳細</Button>
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
