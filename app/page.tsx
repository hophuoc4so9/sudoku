'use client';

import React, { useState } from 'react';
import { Screen1Registration, type ParticipantInfo } from '@/components/Screen1Registration';
import { Screen2SudokuBoard } from '@/components/Screen2SudokuBoard';
import { Screen3Result } from '@/components/Screen3Result';
import { generateRandomSudoku6x6 } from '@/lib/sudoku';

type ScreenState = 'screen1' | 'screen2' | 'screen3';

interface ResultData {
  isCorrect: boolean;
  durationInSeconds: number;
  backtrackingTime: string;
  topPercentage?: number;
  averageDurationInSeconds?: number;
}

export default function SudokuGamePage() {
  const [screen, setScreen] = useState<ScreenState>('screen1');
  const [info, setInfo] = useState<ParticipantInfo>({ fullName: '', studentId: '', major: 'CNTT' });
  const [startTime, setStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);

  // Bộ đề ngẫu nhiên riêng biệt cho từng người
  const [currentPuzzle, setCurrentPuzzle] = useState<number[][]>([]);
  const [currentSolution, setCurrentSolution] = useState<number[][]>([]);

  const handleStart = (data: ParticipantInfo) => {
    setInfo(data);
    // TẠO ĐỀ NGẪU NHIÊN RIÊNG BIỆT CHO THÍ SINH NÀY (có nghiệm duy nhất và solution đi kèm)
    const { puzzle, solution } = generateRandomSudoku6x6(18);
    setCurrentPuzzle(puzzle);
    setCurrentSolution(solution);
    setStartTime(Date.now());
    setScreen('screen2');
  };

  const handleSubmit = async (board: number[][]) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...info,
          startTime,
          board,
          initialPuzzle: currentPuzzle,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Có lỗi xảy ra khi gửi bài!');
        return;
      }
      setResult({
        isCorrect: data.isCorrect,
        durationInSeconds: data.durationInSeconds,
        backtrackingTime: data.backtrackingTime || '0.002',
        topPercentage: data.topPercentage,
        averageDurationInSeconds: data.averageDurationInSeconds,
      });
      setScreen('screen3');
      window.scrollTo({ top: 0 });
    } catch {
      alert('Không thể kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    // Khi chơi lại, tạo luôn 1 đề ngẫu nhiên mới hoàn toàn
    const { puzzle, solution } = generateRandomSudoku6x6(18);
    setCurrentPuzzle(puzzle);
    setCurrentSolution(solution);
    setStartTime(Date.now());
    setScreen('screen2');
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-brand-50 via-white to-white px-4 py-4 sm:py-8">
      {screen === 'screen1' && <Screen1Registration onStart={handleStart} />}
      {screen === 'screen2' && currentPuzzle.length > 0 && (
        <Screen2SudokuBoard
          participantInfo={info}
          initialPuzzle={currentPuzzle}
          solution={currentSolution}
          startTime={startTime}
          onSubmit={handleSubmit}
          onBack={() => setScreen('screen1')}
          isSubmitting={isSubmitting}
        />
      )}
      {screen === 'screen3' && result && (
        <Screen3Result participantInfo={info} result={result} onPlayAgain={handlePlayAgain} />
      )}
    </main>
  );
}
