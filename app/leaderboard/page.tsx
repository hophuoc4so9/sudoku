'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  Clock,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Gift,
  Search,
} from 'lucide-react';

interface ParticipantLeaderboard {
  id: string;
  studentId: string;
  fullName: string;
  major: string;
  durationInSeconds: number;
  isCorrect: boolean;
  isGiftClaimed: boolean;
  createdAt: string;
}

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState<ParticipantLeaderboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [updatingGiftId, setUpdatingGiftId] = useState<string | null>(null);

  // Fetch dữ liệu từ API
  const fetchLeaderboard = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setParticipants(data.data);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Lỗi tải BXH:', e);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Tự động làm mới mỗi 7 giây (phù hợp khoảng 5-10 giây)
  useEffect(() => {
    fetchLeaderboard(false);
    const interval = setInterval(() => {
      fetchLeaderboard(true);
    }, 7000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  // CTV tick nhận quà trực tiếp trên bảng xếp hạng
  const handleToggleGift = async (id: string, currentStatus: boolean) => {
    setUpdatingGiftId(id);
    try {
      const res = await fetch('/api/claim-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isGiftClaimed: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setParticipants((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isGiftClaimed: !currentStatus } : p))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingGiftId(null);
    }
  };

  const filteredParticipants = participants.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-black text-sm border border-amber-300 shadow-sm">
          🥇 Top 1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-200 text-slate-800 font-black text-sm border border-slate-300 shadow-sm">
          🥈 Top 2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-700/10 text-amber-900 font-black text-sm border border-amber-600/30 shadow-sm">
          🥉 Top 3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs">
        #{index + 1}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Về trang thi đấu"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <img
                src="/logo_clb.jpg"
                alt="CLB Logo"
                className="w-10 h-10 rounded-xl object-cover border border-sky-400"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  BẢNG XẾP HẠNG REAL-TIME
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </h1>
                <p className="text-xs text-sky-400 font-medium">
                  CLB Sáng Tạo Số • Trường Đại học Thủ Dầu Một (TDMU)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
            <button
              onClick={() => fetchLeaderboard(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Banner Top 3 Visual (Hero Cards) */}
        {participants.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Top 2 */}
            <div className="order-2 md:order-1 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 text-center flex flex-col justify-between">
              <div>
                <div className="inline-block p-2 rounded-2xl bg-slate-700 mb-2">🥈</div>
                <h3 className="font-extrabold text-base text-slate-100">{participants[1].fullName}</h3>
                <p className="text-xs text-slate-400 font-mono">MSSV: {participants[1].studentId}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-sky-950 text-sky-300 text-xs font-semibold">
                  {participants[1].major}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <span className="text-2xl font-black text-slate-200 font-mono">
                  {participants[1].durationInSeconds}s
                </span>
              </div>
            </div>

            {/* Top 1 Champion */}
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-800 to-slate-800 border-2 border-amber-500/50 rounded-3xl p-6 text-center shadow-xl shadow-amber-500/10 flex flex-col justify-between transform md:-translate-y-2">
              <div>
                <div className="inline-block p-3 rounded-2xl bg-amber-500/20 text-2xl mb-2 border border-amber-400/40">
                  👑
                </div>
                <h3 className="font-black text-lg text-amber-200">{participants[0].fullName}</h3>
                <p className="text-xs text-amber-300/80 font-mono">MSSV: {participants[0].studentId}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  {participants[0].major}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-500/20">
                <p className="text-xs text-amber-400/80 font-medium">Thời gian kỷ lục</p>
                <span className="text-3xl font-black text-amber-300 font-mono">
                  {participants[0].durationInSeconds}s
                </span>
              </div>
            </div>

            {/* Top 3 */}
            <div className="order-3 md:order-3 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 text-center flex flex-col justify-between">
              <div>
                <div className="inline-block p-2 rounded-2xl bg-amber-900/30 mb-2">🥉</div>
                <h3 className="font-extrabold text-base text-slate-100">{participants[2].fullName}</h3>
                <p className="text-xs text-slate-400 font-mono">MSSV: {participants[2].studentId}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-sky-950 text-sky-300 text-xs font-semibold">
                  {participants[2].major}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <span className="text-2xl font-black text-slate-200 font-mono">
                  {participants[2].durationInSeconds}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bảng Danh Sách & Tìm Kiếm */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          {/* Controls: Search */}
          <div className="p-4 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên, MSSV hoặc Ngành..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Top 20 Thí sinh hoàn thành nhanh nhất
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-700">
                  <th className="py-3.5 px-4 w-16 text-center">Hạng</th>
                  <th className="py-3.5 px-4">Thí sinh</th>
                  <th className="py-3.5 px-4">Ngành</th>
                  <th className="py-3.5 px-4 text-right">Thời gian</th>
                  <th className="py-3.5 px-4 text-center">Nhận quà</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-sm font-medium">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                          Đang đồng bộ dữ liệu...
                        </span>
                      ) : (
                        'Chưa có bài thi nào chính xác hoặc không tìm thấy kết quả.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-700/40 transition-colors ${
                        idx < 3 ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        {getRankBadge(idx)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{p.fullName}</div>
                        <div className="text-xs text-slate-400 font-mono">{p.studentId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 text-sky-400 border border-slate-700">
                          {p.major}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400 text-base">
                        {p.durationInSeconds}s
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={updatingGiftId === p.id}
                          onClick={() => handleToggleGift(p.id, p.isGiftClaimed)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                            p.isGiftClaimed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-700/70 text-slate-300 border-slate-600 hover:bg-sky-900/60 hover:text-sky-200 hover:border-sky-500'
                          }`}
                        >
                          {p.isGiftClaimed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Đã nhận quà</span>
                            </>
                          ) : (
                            <>
                              <Gift className="w-3.5 h-3.5 text-amber-400" />
                              <span>Chưa nhận</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
