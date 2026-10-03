'use client';

import React, { useState, useEffect } from 'react';
import { Timer, ArrowLeft, Send, RotateCcw, HelpCircle, CheckCircle } from 'lucide-react';
import { INITIAL_PUZZLE } from '@/lib/sudoku';

interface Screen2Props {
  participantInfo: {
    fullName: string;
    studentId: string;
    major: string;
    phone: string;
  };
  startTime: number;
  onSubmit: (finalBoard: number[][]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const Screen2SudokuBoard: React.FC<Screen2Props> = ({
  participantInfo,
  startTime,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  // Khởi tạo bảng từ INITIAL_PUZZLE (deep copy)
  const [board, setBoard] = useState<number[][]>(() =>
    INITIAL_PUZZLE.map((row) => [...row])
  );

  // Vị trí ô đang được chọn: { row, col } hoặc null
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // Timer đếm giây
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - startTime) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  // Format mm:ss
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Xác định ô cố định (gốc) không được sửa
  const isFixedCell = (r: number, c: number) => {
    return INITIAL_PUZZLE[r][c] !== 0;
  };

  // Chọn ô
  const handleSelectCell = (r: number, c: number) => {
    if (isFixedCell(r, c)) {
      // Có thể vẫn highlight ô cố định để xem số trùng lặp, nhưng không sửa được
      setSelectedCell({ row: r, col: c });
      return;
    }
    setSelectedCell({ row: r, col: c });
  };

  // Điền số vào ô được chọn
  const handleInputNumber = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (isFixedCell(row, col)) return;

    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = num;
      return next;
    });
  };

  // Xóa số tại ô được chọn
  const handleClearCell = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (isFixedCell(row, col)) return;

    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = 0;
      return next;
    });
  };

  // Lắng nghe bàn phím máy tính (hỗ trợ cả desktop/laptop nếu thí sinh gõ số 1-6 hoặc Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 6) {
        handleInputNumber(num);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleClearCell();
      } else if (e.key === 'ArrowUp') {
        setSelectedCell((prev) => prev ? { row: Math.max(0, prev.row - 1), col: prev.col } : null);
      } else if (e.key === 'ArrowDown') {
        setSelectedCell((prev) => prev ? { row: Math.min(5, prev.row + 1), col: prev.col } : null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell((prev) => prev ? { row: prev.row, col: Math.max(0, prev.col - 1) } : null);
      } else if (e.key === 'ArrowRight') {
        setSelectedCell((prev) => prev ? { row: prev.row, col: Math.min(5, prev.col + 1) } : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell]);

  // Đếm số ô còn trống
  const emptyCellsCount = board.reduce(
    (acc, row) => acc + row.filter((val) => val === 0).length,
    0
  );

  const selectedValue =
    selectedCell ? board[selectedCell.row][selectedCell.col] : null;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-[92vh] justify-between pb-4">
      {/* Top Bar: Thí sinh + Đồng hồ bấm giờ */}
      <div>
        <div className="flex items-center justify-between mb-3 bg-white p-3 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              disabled={isSubmitting}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {participantInfo.fullName}
              </p>
              <p className="text-[11px] font-medium text-sky-600">
                MSSV: {participantInfo.studentId} • {participantInfo.major}
              </p>
            </div>
          </div>

          {/* Timer đếm giây chạy liên tục */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
            <Timer className="w-4 h-4 text-sky-600 animate-pulse" />
            <span className="font-mono font-black text-sm tracking-wider">
              {formatTimer(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Luật chơi & Gợi ý khối 2x3 */}
        <div className="flex items-center justify-between px-1 mb-2 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-sky-500" />
            Khối 2 hàng x 3 cột (2x3)
          </span>
          <span className={emptyCellsCount === 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
            Còn {emptyCellsCount} ô trống
          </span>
        </div>

        {/* BÀN CỜ SUDOKU 6x6 */}
        {/* Khối chia: 6 khối gồm 2 hàng x 3 cột (2x3).
            - Phân cách cột: cột 2|3 có viền đậm (border-r-4)
            - Phân cách hàng: hàng 1|2 và hàng 3|4 có viền đậm (border-b-4)
        */}
        <div className="bg-sky-900 p-2 sm:p-2.5 rounded-3xl shadow-xl shadow-sky-900/15 border-2 border-sky-700">
          <div className="grid grid-cols-6 gap-0 bg-sky-950/20 rounded-2xl overflow-hidden border-2 border-slate-700">
            {board.map((row, r) =>
              row.map((val, c) => {
                const isFixed = isFixedCell(r, c);
                const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                const isSameRowOrCol =
                  selectedCell && (selectedCell.row === r || selectedCell.col === c);
                const isSameNumber =
                  selectedValue && selectedValue !== 0 && val === selectedValue;

                // Khối 2x3: 
                // Cột ngăn cách khối là c === 2 (giữa cột 2 và cột 3)
                const isBlockRightBorder = c === 2;
                // Hàng ngăn cách khối là r === 1 và r === 3 (giữa hàng 1 & 2, và hàng 3 & 4)
                const isBlockBottomBorder = r === 1 || r === 3;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleSelectCell(r, c)}
                    className={`
                      sudoku-cell aspect-square flex items-center justify-center font-bold text-lg sm:text-xl
                      border border-slate-300 transition-all duration-75 relative select-none
                      ${isBlockRightBorder ? 'border-r-[3px] border-r-slate-800' : ''}
                      ${isBlockBottomBorder ? 'border-b-[3px] border-b-slate-800' : ''}
                      ${
                        isSelected
                          ? '!bg-sky-500 !text-white z-20 shadow-inner scale-[0.98] ring-2 ring-sky-300'
                          : isFixed
                          ? 'bg-slate-200/95 text-slate-800 font-black'
                          : val !== 0
                          ? 'bg-white text-sky-700 font-extrabold'
                          : 'bg-white/95 text-slate-300 hover:bg-sky-50'
                      }
                      ${!isSelected && isSameNumber ? '!bg-amber-100 !text-amber-900' : ''}
                      ${!isSelected && !isSameNumber && isSameRowOrCol ? '!bg-sky-50/70' : ''}
                    `}
                  >
                    {val !== 0 ? val : ''}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* BÀN PHÍM SỐ ẢO MOBILE-FIRST & NÚT NỘP BÀI */}
      <div className="mt-4 space-y-3">
        {/* Nút bấm số 1 - 6 và Xóa: Nút to, vừa tầm ngón tay cái */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-sky-100 shadow-md">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleInputNumber(num)}
              className="h-13 sm:h-14 rounded-xl bg-slate-50 hover:bg-sky-100 active:bg-sky-600 active:text-white border border-slate-200 hover:border-sky-300 text-sky-950 font-black text-xl transition flex items-center justify-center shadow-sm select-none"
            >
              {num}
            </button>
          ))}
          {/* Nút Xóa */}
          <button
            type="button"
            onClick={handleClearCell}
            className="h-13 sm:h-14 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-500 active:text-white border border-rose-200 text-rose-600 font-bold text-xs sm:text-sm transition flex flex-col items-center justify-center shadow-sm select-none"
            title="Xóa ô"
          >
            <span className="text-base leading-none">⌫</span>
            <span className="text-[10px] mt-0.5">Xóa</span>
          </button>
        </div>

        {/* Nút Nộp Bài To Bự Ở Cuối Màn Hình */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSubmit(board)}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2 ${
            emptyCellsCount === 0
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25 ring-2 ring-emerald-300'
              : 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-sky-500/30'
          } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang chấm bài & ghi nhận...
            </span>
          ) : (
            <>
              <span>NỘP BÀI THỬ THÁCH</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
