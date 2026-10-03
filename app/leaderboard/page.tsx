'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Gift, RefreshCw, Search } from 'lucide-react';

interface Row {
  id: string;
  studentId: string;
  fullName: string;
  major: string;
  durationInSeconds: number;
  isGiftClaimed: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setRows(data.data);
        setUpdatedAt(new Date());
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Tự động làm mới mỗi 7 giây
  useEffect(() => {
    load();
    const id = setInterval(() => load(true), 7000);
    return () => clearInterval(id);
  }, [load]);

  const toggleGift = async (row: Row) => {
    setBusyId(row.id);
    try {
      const res = await fetch('/api/claim-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, isGiftClaimed: !row.isGiftClaimed }),
      });
      if ((await res.json()).success) {
        setRows((p) => p.map((r) => (r.id === row.id ? { ...r, isGiftClaimed: !r.isGiftClaimed } : r)));
      }
    } finally {
      setBusyId(null);
    }
  };

  const filtered = rows.filter((r) =>
    `${r.fullName} ${r.studentId} ${r.major}`.toLowerCase().includes(q.toLowerCase())
  );
  const podium = rows.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white pb-12">
      <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-xl p-2 text-brand-700 hover:bg-brand-50" aria-label="Về trang chơi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src="/logo_clb.jpg" alt="CLB" className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-100" />
            <div>
              <h1 className="flex items-center gap-2 text-lg font-black text-brand-800">
                Bảng xếp hạng Sudoku 6x6
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 ring-1 ring-green-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /> LIVE
                </span>
              </h1>
              <p className="text-xs font-medium text-brand-500">CLB Sáng Tạo Số · Trường ĐH Thủ Dầu Một</p>
            </div>
          </div>
          <button
            onClick={() => load()}
            className="flex items-center gap-1.5 rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{updatedAt ? updatedAt.toLocaleTimeString('vi-VN') : 'Làm mới'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4">
        {/* Podium Top 3 */}
        {podium.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {podium.map((p, i) => (
              <div
                key={p.id}
                className={`card p-5 text-center ${i === 0 ? 'border-2 !border-brand-500 md:order-2 md:-translate-y-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
              >
                <div className="text-4xl">{MEDALS[i]}</div>
                <p className="mt-2 text-lg font-black text-brand-900">{p.fullName}</p>
                <p className="font-mono text-xs text-slate-500">{p.studentId} · {p.major}</p>
                <p className={`mt-3 font-mono text-3xl font-black ${i === 0 ? 'text-brand-600' : 'text-brand-800'}`}>
                  {p.durationInSeconds}s
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên, MSSV, ngành..."
                className="input-field !py-2 pl-10"
              />
            </div>
            <span className="text-xs font-medium text-slate-500">Top 20 giải đúng nhanh nhất</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-xs font-bold uppercase text-brand-700">
                <tr>
                  <th className="w-16 px-4 py-3 text-center">Hạng</th>
                  <th className="px-4 py-3">Thí sinh</th>
                  <th className="px-4 py-3">Ngành</th>
                  <th className="px-4 py-3 text-right">Thời gian</th>
                  <th className="px-4 py-3 text-center">Quà</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      {loading ? 'Đang tải dữ liệu...' : 'Chưa có dữ liệu.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => {
                    const idx = rows.indexOf(r);
                    return (
                      <tr key={r.id} className="hover:bg-brand-50/50">
                        <td className="px-4 py-3 text-center text-lg font-black text-brand-700">
                          {MEDALS[idx] ?? <span className="text-sm text-slate-400">#{idx + 1}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-brand-900">{r.fullName}</p>
                          <p className="font-mono text-xs text-slate-500">{r.studentId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">{r.major}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-base font-black text-brand-600">
                          {r.durationInSeconds}s
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            disabled={busyId === r.id}
                            onClick={() => toggleGift(r)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                              r.isGiftClaimed
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-brand-100 bg-white text-brand-700 hover:bg-brand-50'
                            }`}
                          >
                            {r.isGiftClaimed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Gift className="h-3.5 w-3.5" />}
                            {r.isGiftClaimed ? 'Đã nhận' : 'Chưa nhận'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
