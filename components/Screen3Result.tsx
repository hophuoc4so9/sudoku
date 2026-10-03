'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BarChart3, CheckCircle2, Clock, Cpu, Gift, RotateCcw, XCircle } from 'lucide-react';
import type { ParticipantInfo } from './Screen1Registration';
import { FANPAGE_URL } from '@/lib/config';

interface Screen3Props {
  participantInfo: ParticipantInfo;
  result: {
    isCorrect: boolean;
    durationInSeconds: number;
    backtrackingTime: string;
    topPercentage?: number;
    averageDurationInSeconds?: number;
  };
  onPlayAgain: () => void;
}

export const Screen3Result: React.FC<Screen3Props> = ({ participantInfo, result, onPlayAgain }) => {
  useEffect(() => {
    if (!result.isCorrect) return;
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#1563c4', '#4f9bf0', '#bfdbfe', '#ffffff'],
    });
  }, [result.isCorrect]);

  const top = result.topPercentage ?? 100;
  const avg = result.averageDurationInSeconds ?? result.durationInSeconds;
  const actual = result.durationInSeconds;
  const diff = avg - actual;

  return (
    <div className="mx-auto w-full max-w-md space-y-4 pb-8 animate-fade-up">
      {/* Kết quả */}
      <div className="card overflow-hidden text-center">
        <div className={`px-6 pb-6 pt-7 ${result.isCorrect ? 'bg-gradient-to-b from-brand-50 to-white' : 'bg-gradient-to-b from-red-50 to-white'}`}>
          <div
            className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg ${
              result.isCorrect ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'
            }`}
          >
            {result.isCorrect ? <CheckCircle2 className="h-9 w-9" /> : <XCircle className="h-9 w-9" />}
          </div>
          <h2 className="text-2xl font-black text-brand-900">
            {result.isCorrect ? 'Chính xác! 🎉' : 'Chưa chính xác 😅'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {result.isCorrect
              ? `Chúc mừng ${participantInfo.fullName} đã hoàn thành thử thách!`
              : 'Bảng còn số bị trùng. Thử lại để nhận quà nhé!'}
          </p>

          {result.isCorrect && (
            <div className="mt-5 rounded-2xl bg-brand-600 p-4 text-white shadow-lg shadow-brand-600/25">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-100">
                Bạn đang thuộc nhóm
              </p>
              <p className="text-4xl font-black tracking-tight">TOP {top}%</p>
              <p className="mt-1 text-xs text-brand-100">
                {top <= 10
                  ? '🔥 Nhóm giải nhanh nhất sự kiện!'
                  : top <= 30
                  ? '⚡ Nhanh hơn phần lớn người chơi!'
                  : '👍 Hoàn thành rất tốt!'}
              </p>
            </div>
          )}
        </div>

        {result.isCorrect && (
          <div className="grid grid-cols-2 divide-x divide-brand-100 border-t border-brand-100">
            <div className="p-4">
              <p className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-slate-500">
                <Clock className="h-3.5 w-3.5 text-brand-500" /> Thời gian của bạn
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-brand-700">{actual}s</p>
              <p className={`text-[11px] font-semibold ${diff > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                {diff > 0 ? `Nhanh hơn TB ${diff}s` : diff < 0 ? `Chậm hơn TB ${-diff}s` : 'Bằng trung bình'}
              </p>
            </div>
            <div className="p-4">
              <p className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase text-slate-500">
                <BarChart3 className="h-3.5 w-3.5 text-brand-500" /> Trung bình
              </p>
              <p className="mt-1 font-mono text-2xl font-black text-slate-700">{avg}s</p>
              <p className="text-[11px] text-slate-400">của người giải đúng</p>
            </div>
          </div>
        )}
      </div>

      {/* Mã nhận quà */}
      <div className="card border-2 border-dashed !border-brand-300 p-5 text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700">
          <Gift className="h-4 w-4" /> Mã nhận quà tại gian hàng
        </p>
        <p className="mt-1 select-all font-mono text-3xl font-black tracking-widest text-brand-600">
          {participantInfo.studentId}
        </p>
        <p className="mt-1 text-xs text-slate-500">Đưa màn hình này cho CTV để nhận quà</p>
      </div>

      {/* Người vs Máy */}
      <div className="card p-5">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-brand-800">
          Con người vs Thuật toán
        </p>
        <div className="flex items-stretch gap-3">
          <div className="flex-1 rounded-2xl bg-brand-50 p-3 text-center">
            <p className="text-[11px] font-semibold text-slate-500">🧠 Bạn</p>
            <p className="font-mono text-xl font-black text-brand-800">{actual}s</p>
          </div>
          <div className="flex items-center text-xs font-black text-brand-300">VS</div>
          <div className="flex-1 rounded-2xl bg-brand-600 p-3 text-center text-white">
            <p className="flex items-center justify-center gap-1 text-[11px] font-semibold text-brand-100">
              <Cpu className="h-3 w-3" /> Backtracking
            </p>
            <p className="font-mono text-xl font-black">{result.backtrackingTime}s</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs italic leading-relaxed text-slate-500">
          Máy tính thử hàng triệu khả năng mỗi giây — nhưng thuật toán do con người viết ra.
        </p>
      </div>

      {/* CLB */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-xl shadow-brand-700/20">
        <div className="mb-3 flex items-center gap-3">
          <img src="/logo_clb.jpg" alt="CLB" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
          <div>
            <p className="text-base font-black leading-tight">CLB Sáng Tạo Số</p>
            <p className="text-[11px] text-brand-100">Trường Đại học Thủ Dầu Một</p>
          </div>
        </div>
        <p className="text-sm font-semibold">Thích giải đố? Bạn hợp với lập trình thi đấu đấy!</p>
        <ul className="mt-3 space-y-2 text-[13px] text-brand-50">
          <li>🏆 Luyện thi Olympic Tin học Sinh viên & ICPC</li>
          <li>💡 Học giải thuật, cấu trúc dữ liệu từ cơ bản</li>
          <li>💻 Làm dự án Web, App, AI cùng các anh chị khóa trên</li>
        </ul>
        <a
          href={FANPAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 block rounded-xl bg-white py-3 text-center text-sm font-extrabold text-brand-700 transition hover:bg-brand-50 active:scale-[0.98]"
        >
          Tham gia CLB ngay
        </a>
      </div>

      <button
        type="button"
        onClick={onPlayAgain}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-100 bg-white py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
      >
        <RotateCcw className="h-4 w-4" /> Chơi lại
      </button>
    </div>
  );
};
