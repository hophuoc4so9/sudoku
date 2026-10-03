'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Clock,
  Sparkles,
  Gift,
  RotateCcw,
  Code2,
  Users,
  Compass,
} from 'lucide-react';

interface Screen3Props {
  participantInfo: {
    fullName: string;
    studentId: string;
    major: string;
  };
  result: {
    isCorrect: boolean;
    durationInSeconds: number;
    backtrackingTime: string;
  };
  onPlayAgain: () => void;
}

export const Screen3Result: React.FC<Screen3Props> = ({
  participantInfo,
  result,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (result.isCorrect) {
      // Bắn pháo hoa ăn mừng khi giải đúng
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#0d9488', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        // Ignored
      }
    }
  }, [result.isCorrect]);

  return (
    <div className="w-full max-w-md mx-auto space-y-5 pb-8">
      {/* BADGE THÔNG BÁO KẾT QUẢ */}
      <div
        className={`rounded-3xl p-6 text-center shadow-xl border ${
          result.isCorrect
            ? 'bg-gradient-to-b from-emerald-50 via-teal-50 to-white border-emerald-200 shadow-emerald-500/10'
            : 'bg-gradient-to-b from-rose-50 via-orange-50 to-white border-rose-200 shadow-rose-500/10'
        }`}
      >
        <div className="inline-flex p-3 rounded-2xl mb-3 shadow-inner">
          {result.isCorrect ? (
            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : (
            <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/30">
              <XCircle className="w-10 h-10" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {result.isCorrect ? 'CHÍNH XÁC HOÀN TOÀN! 🎉' : 'CHƯA CHÍNH XÁC RỒI! 😅'}
        </h2>
        <p className="text-sm font-medium text-slate-600 mt-1">
          {result.isCorrect
            ? `Chúc mừng bạn ${participantInfo.fullName} đã giải thành công câu đố!`
            : 'Một số số bị trùng lặp hoặc chưa điền kín. Hãy thử lại để ghi danh nhé!'}
        </p>

        {/* MÃ NHẬN QUÀ TẠI GIAN HÀNG */}
        <div className="mt-5 p-4 rounded-2xl bg-white border-2 border-dashed border-sky-300 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4 text-sky-600 animate-bounce" />
            Mã Nhận Quà Tại Gian Hàng
          </div>
          <div className="text-2xl font-black text-sky-600 tracking-widest font-mono select-all">
            {participantInfo.studentId}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            👉 Đưa màn hình hoặc đọc MSSV này cho CTV tại bàn đón tiếp để nhận quà lưu niệm!
          </p>
        </div>
      </div>

      {/* KHỐI SO SÁNH THÚ VỊ: TƯ DUY CON NGƯỜI vs THUẬT TOÁN BACKTRACKING */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xl shadow-sky-950/5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Góc Nhìn Thuật Toán & Tốc Độ
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Người */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Tư duy con người
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1">
              {result.durationInSeconds}{' '}
              <span className="text-xs font-normal text-slate-500">giây</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Suy luận logic & trực giác</p>
          </div>

          {/* Máy - Backtracking */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-center">
            <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <Code2 className="w-3 h-3 text-sky-600" />
              Backtracking
            </p>
            <p className="text-2xl font-black text-sky-700 mt-1 font-mono">
              ~{result.backtrackingTime}{' '}
              <span className="text-xs font-normal text-sky-600">giây</span>
            </p>
            <p className="text-[10px] text-sky-600/80 mt-0.5">Quay lui duyệt trạng thái</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed text-center italic">
          💡 "Máy tính có thể thử hàng triệu phép tính trong chớp mắt, nhưng chính tư duy thuật toán của bạn mới là chiếc chìa khóa tối ưu chương trình."
        </p>
      </div>

      {/* TEXT TRUYỀN THÔNG CLB SÁNG TẠO SỐ - TDMU */}
      <div className="bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h4 className="font-extrabold text-sm tracking-wide uppercase text-sky-200">
            CLB Sáng Tạo Số - TDMU
          </h4>
        </div>

        <h3 className="text-lg font-black leading-snug">
          Đam mê Lập trình & Giải thuật? Gia nhập ngay ngôi nhà chung!
        </h3>

        <p className="text-xs text-sky-100/90 mt-2.5 leading-relaxed">
          CLB là môi trường rèn luyện học thuật dành riêng cho sinh viên các chuyên ngành{' '}
          <strong className="text-white">CNTT, Kỹ thuật Phần mềm và Trí tuệ Nhân tạo</strong> tại Trường ĐH Thủ Dầu Một:
        </p>

        <ul className="mt-3 space-y-2 text-xs text-sky-100">
          <li className="flex items-start gap-2">
            <span className="p-1 rounded-md bg-sky-700/80 text-sky-200 text-[10px]">🏆</span>
            <span>
              Huấn luyện Lập trình thi đấu, chinh phục <strong>Olympic Tin học Sinh viên</strong> và <strong>ICPC Toàn cầu</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="p-1 rounded-md bg-sky-700/80 text-sky-200 text-[10px]">💻</span>
            <span>
              Thực chiến các dự án Web/App, AI, Data Science cùng các tiền bối và doanh nghiệp công nghệ.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="p-1 rounded-md bg-sky-700/80 text-sky-200 text-[10px]">🤝</span>
            <span>
              Kết nối cộng đồng anh em coder nhiệt huyết, chia sẻ học bổng, đồ án và định hướng nghề nghiệp.
            </span>
          </li>
        </ul>

        {/* Nút đăng ký gia nhập / Fanpage */}
        <div className="mt-5 pt-4 border-t border-sky-800/80 flex flex-col sm:flex-row gap-2.5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-white text-sky-900 hover:bg-sky-50 font-extrabold text-xs text-center shadow-md transition"
          >
            Theo dõi Fanpage CLB
          </a>
          <a
            href="/leaderboard"
            className="flex-1 py-3 px-4 rounded-xl bg-sky-800/80 hover:bg-sky-700 text-sky-100 font-bold text-xs text-center border border-sky-600 transition flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Xem Bảng Xếp Hạng
          </a>
        </div>
      </div>

      {/* Nút Thử lại */}
      <button
        type="button"
        onClick={onPlayAgain}
        className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Thử Thách Lại Lần Nữa
      </button>
    </div>
  );
};
