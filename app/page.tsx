'use client';

import React, { useState } from 'react';
import { SharedRegistrationForm, type ParticipantInfo } from '@/components/Screen1Registration';
import { Screen2SudokuBoard } from '@/components/Screen2SudokuBoard';
import { Screen3Result } from '@/components/Screen3Result';
import { CodeSprintGame } from '@/components/CodeSprintGame';
import { generateRandomSudoku6x6 } from '@/lib/sudoku';

type ScreenState = 'screen1' | 'sudoku_playing' | 'sudoku_result' | 'code_sprint_playing';

interface ResultData {
  isCorrect: boolean;
  durationInSeconds: number;
  backtrackingTime: string;
  topPercentage?: number;
  averageDurationInSeconds?: number;
}

export default function UnifiedGamePage() {
  const [screen, setScreen] = useState<ScreenState>('screen1');
  const [info, setInfo] = useState<ParticipantInfo>({
    fullName: '',
    studentId: '',
    phone: '',
    major: 'CNTT',
    selectedGame: 'SUDOKU',
  });

  const [startTime, setStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);

  // Bộ đề ngẫu nhiên riêng biệt cho Sudoku
  const [currentPuzzle, setCurrentPuzzle] = useState<number[][]>([]);
  const [currentSolution, setCurrentSolution] = useState<number[][]>([]);

  // Bắt đầu chơi: Kiểm tra môn thi đã chọn
  const handleStart = (data: ParticipantInfo) => {
    setInfo(data);
    setStartTime(Date.now());

    if (data.selectedGame === 'CODE_SPRINT') {
      // Chuyển sang màn hình chơi Code Sprint C++ TRÊN CÙNG 1 TRANG
      setScreen('code_sprint_playing');
    } else {
      // Chuyển sang màn hình chơi Sudoku 6x6
      const { puzzle, solution } = generateRandomSudoku6x6(18);
      setCurrentPuzzle(puzzle);
      setCurrentSolution(solution);
      setScreen('sudoku_playing');
    }
  };

  // Nộp bài Sudoku
  const handleSudokuSubmit = async (board: number[][]) => {
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
          gameType: 'SUDOKU',
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
      setScreen('sudoku_result');
      window.scrollTo({ top: 0 });
    } catch {
      alert('Không thể kết nối máy chủ. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSudokuPlayAgain = () => {
    const { puzzle, solution } = generateRandomSudoku6x6(18);
    setCurrentPuzzle(puzzle);
    setCurrentSolution(solution);
    setStartTime(Date.now());
    setScreen('sudoku_playing');
  };

  const handleCodeSprintPlayAgain = () => {
    setStartTime(Date.now());
    setScreen('code_sprint_playing');
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-brand-50 via-white to-white px-4 py-4 sm:py-8">
      {/* 1. MÀN HÌNH CHỌN MÔN & ĐĂNG NHẬP THÔNG TIN (DUY NHẤT 1 GIAO DIỆN) */}
      {screen === 'screen1' && (
        <SharedRegistrationForm onStart={handleStart} initialGame={info.selectedGame} />
      )}

      {/* 2. MÔN SUDOKU 6X6: ĐANG CHƠI */}
      {screen === 'sudoku_playing' && currentPuzzle.length > 0 && (
        <Screen2SudokuBoard
          participantInfo={info}
          initialPuzzle={currentPuzzle}
          solution={currentSolution}
          startTime={startTime}
          onSubmit={handleSudokuSubmit}
          onBack={() => setScreen('screen1')}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 3. MÔN SUDOKU 6X6: KẾT QUẢ & MÃ QUÀ */}
      {screen === 'sudoku_result' && result && (
        <Screen3Result
          participantInfo={info}
          result={result}
          onPlayAgain={handleSudokuPlayAgain}
        />
      )}

      {/* 4. MÔN CODE SPRINT C++: ĐANG CHƠI & KẾT QUẢ */}
      {screen === 'code_sprint_playing' && (
        <CodeSprintGame
          participantInfo={info}
          startTime={startTime}
          onBack={() => setScreen('screen1')}
          onPlayAgain={handleCodeSprintPlayAgain}
        />
      )}
    </main>
  );
}
