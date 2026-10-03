'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Delete, RotateCcw, Send, Timer } from 'lucide-react';
import { INITIAL_PUZZLE } from '@/lib/sudoku';
import type { ParticipantInfo } from './Screen1Registration';

type Cell = [number, number];

interface Screen2Props {
  participantInfo: ParticipantInfo;
  startTime: number;
  onSubmit: (finalBoard: number[][]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

// ===== Tiền tính các nhóm: 6 hàng, 6 cột, 6 khối 2x3 =====
const ROWS: Cell[][] = Array.from({ length: 6 }, (_, r) => Array.from({ length: 6 }, (_, c) => [r, c] as Cell));
const COLS: Cell[][] = Array.from({ length: 6 }, (_, c) => Array.from({ length: 6 }, (_, r) => [r, c] as Cell));
const BLOCKS: Cell[][] = [];
for (let br = 0; br < 6; br += 2) {
  for (let bc = 0; bc < 6; bc += 3) {
    const cells: Cell[] = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) cells.push([br + r, bc + c]);
    BLOCKS.push(cells);
  }
}
const ALL_GROUPS = [...ROWS, ...COLS, ...BLOCKS];

const k = (r: number, c: number) => `${r}-${c}`;
const blockIndex = (r: number, c: number) => Math.floor(r / 2) * 2 + Math.floor(c / 3);
const isFixed = (r: number, c: number) => INITIAL_PUZZLE[r][c] !== 0;

/** Trả về tập các ô đang bị trùng số (cùng hàng / cột / khối). */
function findConflicts(board: number[][]): Set<string> {
  const result = new Set<string>();
  for (const group of ALL_GROUPS) {
    const seen = new Map<number, Cell[]>();
    for (const [r, c] of group) {
      const v = board[r][c];
      if (!v) continue;
      seen.set(v, [...(seen.get(v) ?? []), [r, c]]);
    }
    seen.forEach((cells) => {
      if (cells.length > 1) cells.forEach(([r, c]) => result.add(k(r, c)));
    });
  }
  return result;
}

/** Các nhóm chứa ô (r,c) vừa được điền đầy đủ và đúng (1..6 không trùng). */
function completedGroupsAt(board: number[][], r: number, c: number): Set<string> {
  const groups = [ROWS[r], COLS[c], BLOCKS[blockIndex(r, c)]];
  const result = new Set<string>();
  for (const g of groups) {
    const values = g.map(([gr, gc]) => board[gr][gc]);
    if (values.every((v) => v !== 0) && new Set(values).size === 6) {
      g.forEach(([gr, gc]) => result.add(k(gr, gc)));
    }
  }
  return result;
}

const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export const Screen2SudokuBoard: React.FC<Screen2Props> = ({
  participantInfo,
  startTime,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const [board, setBoard] = useState<number[][]>(() => INITIAL_PUZZLE.map((row) => [...row]));
  const [selected, setSelected] = useState<Cell | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [flashCells, setFlashCells] = useState<Set<string>>(new Set());
  const [flashId, setFlashId] = useState(0);
  const [shakeCell, setShakeCell] = useState<{ key: string; id: number } | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>();

  // Đồng hồ đếm giây
  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const conflicts = useMemo(() => findConflicts(board), [board]);
  const emptyCount = useMemo(() => board.flat().filter((v) => v === 0).length, [board]);
  const numberCounts = useMemo(() => {
    const counts = Array(7).fill(0);
    board.flat().forEach((v) => counts[v]++);
    return counts;
  }, [board]);

  const selectedValue = selected ? board[selected[0]][selected[1]] : 0;

  const writeCell = useCallback(
    (value: number) => {
      if (!selected) return;
      const [r, c] = selected;
      if (isFixed(r, c) || board[r][c] === value) return;
      // Số đã điền đủ 6 lần -> không cho điền thêm
      if (value !== 0 && numberCounts[value] >= 6) return;

      const next = board.map((row) => [...row]);
      next[r][c] = value;
      setBoard(next);

      if (value === 0) return;

      // Điền trùng -> rung ô
      if (findConflicts(next).has(k(r, c))) {
        setShakeCell({ key: k(r, c), id: Date.now() });
        return;
      }

      // Hoàn thành hàng / cột / khối -> nháy xanh 1 lần
      const done = completedGroupsAt(next, r, c);
      if (done.size > 0) {
        clearTimeout(flashTimer.current);
        setFlashCells(done);
        setFlashId((id) => id + 1);
        flashTimer.current = setTimeout(() => setFlashCells(new Set()), 950);
      }
    },
    [board, selected, numberCounts]
  );

  // Hỗ trợ bàn phím vật lý (laptop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= 6) return writeCell(n);
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') return writeCell(0);
      const moves: Record<string, Cell> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };
      const m = moves[e.key];
      if (m) {
        e.preventDefault();
        setSelected((p) => {
          const [r, c] = p ?? [0, 0];
          return [Math.min(5, Math.max(0, r + m[0])), Math.min(5, Math.max(0, c + m[1]))];
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [writeCell]);

  const handleReset = () => {
    if (confirm('Xóa toàn bộ các số đã điền và làm lại?')) {
      setBoard(INITIAL_PUZZLE.map((row) => [...row]));
      setSelected(null);
    }
  };

  const getCellClass = (r: number, c: number, v: number) => {
    const key = k(r, c);
    const fixed = isFixed(r, c);
    const isSel = selected?.[0] === r && selected?.[1] === c;
    const related =
      selected &&
      (selected[0] === r || selected[1] === c || blockIndex(selected[0], selected[1]) === blockIndex(r, c));
    const sameNum = v !== 0 && v === selectedValue;
    const conflict = conflicts.has(key);

    // Nền
    let bg = fixed ? 'bg-slate-100' : 'bg-white';
    if (related) bg = fixed ? 'bg-brand-100/70' : 'bg-brand-50';
    if (sameNum) bg = 'bg-brand-200/80';
    if (conflict) bg = 'bg-red-50';
    if (isSel) bg = conflict ? 'bg-red-100' : 'bg-brand-200';

    // Chữ
    let text = fixed ? 'text-brand-900 font-black' : 'text-brand-600 font-bold';
    if (conflict) text = 'text-red-600 font-black';

    // Viền: đậm giữa các khối 2x3
    const borderR = c === 5 ? '' : c === 2 ? 'border-r-2 border-r-brand-700' : 'border-r border-r-brand-100';
    const borderB = r === 5 ? '' : r === 1 || r === 3 ? 'border-b-2 border-b-brand-700' : 'border-b border-b-brand-100';

    const anim = flashCells.has(key) ? 'animate-flash' : shakeCell?.key === key ? 'animate-shake' : '';
    const ring = isSel ? 'z-10 ring-2 ring-inset ring-brand-600' : '';

    return `sudoku-cell relative flex aspect-square items-center justify-center text-2xl transition-colors duration-100 ${bg} ${text} ${borderR} ${borderB} ${ring} ${anim}`;
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-md flex-col animate-fade-up">
      {/* Header */}
      <div className="card mb-4 flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-xl p-2 text-brand-700 transition hover:bg-brand-50"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-900">{participantInfo.fullName}</p>
            <p className="text-[11px] font-medium text-slate-500">
              {participantInfo.studentId} · {participantInfo.major}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-white shadow-md shadow-brand-600/25">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-base font-black tabular-nums">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Trạng thái */}
      <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold">
        <span className={conflicts.size ? 'text-red-500' : 'text-slate-500'}>
          {conflicts.size ? `⚠ Có ${conflicts.size} ô đang bị trùng` : 'Khối 2 hàng × 3 cột'}
        </span>
        <div className="flex items-center gap-3">
          <span className={emptyCount === 0 ? 'text-green-600' : 'text-brand-600'}>
            {emptyCount === 0 ? '✓ Đã điền đủ' : `Còn ${emptyCount} ô`}
          </span>
          <button onClick={handleReset} className="flex items-center gap-1 text-slate-400 hover:text-brand-600">
            <RotateCcw className="h-3.5 w-3.5" /> Làm lại
          </button>
        </div>
      </div>

      {/* Bàn cờ */}
      <div className="grid grid-cols-6 overflow-hidden rounded-2xl border-2 border-brand-700 bg-white shadow-[0_10px_30px_rgba(14,79,163,0.15)]">
        {board.map((row, r) =>
          row.map((v, c) => (
            <button
              key={`${k(r, c)}-${flashCells.has(k(r, c)) ? flashId : 0}-${shakeCell?.key === k(r, c) ? shakeCell.id : 0}`}
              type="button"
              onClick={() => setSelected([r, c])}
              className={getCellClass(r, c, v)}
            >
              {v !== 0 && <span className={isFixed(r, c) ? '' : 'animate-pop'}>{v}</span>}
            </button>
          ))
        )}
      </div>

      {/* Bàn phím số */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const full = numberCounts[n] >= 6;
          return (
            <button
              key={n}
              type="button"
              disabled={full}
              onClick={() => writeCell(n)}
              className={`relative h-14 rounded-2xl border-2 text-2xl font-black transition ${
                full
                  ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through'
                  : 'border-brand-100 bg-white text-brand-700 shadow-sm hover:border-brand-300 active:scale-95 active:bg-brand-600 active:text-white'
              }`}
            >
              {n}
              {!full && (
                <span className="absolute right-1.5 top-1 text-[9px] font-bold text-brand-300">
                  {6 - numberCounts[n]}
                </span>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => writeCell(0)}
          className="col-span-2 flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-brand-100 bg-brand-50 text-sm font-bold text-brand-700 transition active:scale-95 active:bg-brand-100"
        >
          <Delete className="h-5 w-5" /> Xóa
        </button>
      </div>

      {/* Nộp bài */}
      <div className="mt-auto pt-5">
        <button
          type="button"
          disabled={isSubmitting || emptyCount > 0}
          onClick={() => onSubmit(board)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang chấm bài...
            </>
          ) : emptyCount > 0 ? (
            `Điền nốt ${emptyCount} ô để nộp bài`
          ) : (
            <>
              NỘP BÀI <Send className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
