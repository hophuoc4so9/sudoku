'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Gift, RefreshCw, Search, Grid, Code2, Trophy } from 'lucide-react';

interface Row {
  id: string;
  studentId: string;
  fullName: string;
  major: string;
  gameType: string;
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

  // Tab lọc môn thi: 'ALL' | 'SUDOKU' | 'CODE_SPRINT'
  const [selectedGame, setSelectedGame] = useState<'ALL' | 'SUDOKU' | 'CODE_SPRINT'>('ALL');

  const load = useCallback(async (silent = false, gameFilter = selectedGame) => {
    if (!silent) setLoading(true);
    try {
      const url = `/api/leaderboard?gameType=${gameFilter}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setRows(data.data);
        setUpdatedAt(new Date());
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedGame]);

  // Tự động làm mới mỗi 7 giây
  useEffect(() => {
    load(false, selectedGame);
    const id = setInterval(() => load(true, selectedGame), 7000);
    return () => clearInterval(id);
  }, [load, selectedGame]);

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
  const podium = filtered.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white pb-12">
      {/* Header Bar */}
      <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-xl p-2 text-brand-700 hover:bg-brand-50" aria-label="Về trang chơi">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src="/logo_clb.jpg" alt="CLB" className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-100" />
            <div>
              <h1 className="flex items-center gap-2 text-base sm:text-lg font-black text-brand-800">
                BẢNG XẾP HẠNG GIAN HÀNG
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 ring-1 ring-green-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /> LIVE
                </span>
              </h1>
              <p className="text-xs font-medium text-brand-500">CLB Sáng Tạo Số · Trường ĐH Thủ Dầu Một</p>
            </div>
          </div>
          <button
            onClick={() => load(false)}
            className="flex items-center gap-1.5 rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{updatedAt ? updatedAt.toLocaleTimeString('vi-VN') : 'Làm mới'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-6xl px-4">
        {/* BỘ NÚT CHỌN LỌC MÔN THI ĐẤU (TAB SWITCHER) */}
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSelectedGame('ALL')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 border ${
              selectedGame === 'ALL'
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tất cả thí sinh ({rows.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGame('SUDOKU')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 border ${
              selectedGame === 'SUDOKU'
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Môn: Sudoku 6x6</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGame('CODE_SPRINT')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 border ${
              selectedGame === 'CODE_SPRINT'
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Môn: Code Sprint C++</span>
          </button>
        </div>

        {/* Podium Top 3 */}
        {podium.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {podium.map((p, i) => (
              <div
                key={p.id}
                className={`card p-5 text-center ${
                  i === 0
                    ? 'border-2 !border-brand-500 shadow-lg md:order-2 md:-translate-y-2'
                    : i === 1
                    ? 'md:order-1'
                    : 'md:order-3'
                }`}
              >
                <div className="text-4xl">{MEDALS[i]}</div>
                <p className="mt-2 text-base font-black text-brand-900">{p.fullName}</p>
                <p className="font-mono text-xs text-slate-500">{p.studentId}</p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-100">
                    {p.major}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {p.gameType === 'CODE_SPRINT' ? 'Code Sprint' : 'Sudoku'}
                  </span>
                </div>
                <p className={`mt-3 font-mono text-2xl font-black ${i === 0 ? 'text-brand-600' : 'text-brand-800'}`}>
                  {p.durationInSeconds}s
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Danh sách chi tiết */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên, MSSV, ngành..."
                className="input-field !py-2 pl-10 text-xs"
              />
            </div>
            <span className="text-xs font-medium text-slate-500">
              Danh sách hoàn thành hợp lệ (xếp theo thời gian)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-xs font-bold uppercase text-brand-700">
                <tr>
                  <th className="w-16 px-4 py-3 text-center">Hạng</th>
                  <th className="px-4 py-3">Thí sinh</th>
                  <th className="px-4 py-3">Môn thi</th>
                  <th className="px-4 py-3">Ngành</th>
                  <th className="px-4 py-3 text-right">Thời gian</th>
                  <th className="px-4 py-3 text-center">Nhận quà</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      {loading ? 'Đang tải dữ liệu...' : 'Chưa có kết quả nào trong danh mục này.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, idx) => {
                    return (
                      <tr key={r.id} className="hover:bg-brand-50/50 transition">
                        <td className="px-4 py-3 text-center text-lg font-black text-brand-700">
                          {MEDALS[idx] ?? <span className="text-sm text-slate-400">#{idx + 1}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-brand-900">{r.fullName}</p>
                          <p className="font-mono text-xs text-slate-500">{r.studentId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold ${
                              r.gameType === 'CODE_SPRINT'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-sky-50 text-sky-700 border border-sky-200'
                            }`}
                          >
                            {r.gameType === 'CODE_SPRINT' ? 'Code Sprint' : 'Sudoku 6x6'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
                            {r.major}
                          </span>
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
                                : 'border-brand-100 bg-white text-brand-700 hover:bg-brand-50 shadow-sm'
                            }`}
                          >
                            {r.isGiftClaimed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Gift className="h-3.5 w-3.5" />}
                            {r.isGiftClaimed ? 'Đã nhận quà' : 'Chưa nhận'}
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
