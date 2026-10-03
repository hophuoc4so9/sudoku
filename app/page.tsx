'use client';

import React, { useState } from 'react';
import { Screen1Registration } from '@/components/Screen1Registration';
import { Screen2SudokuBoard } from '@/components/Screen2SudokuBoard';
import { Screen3Result } from '@/components/Screen3Result';

type ScreenState = 'screen1' | 'screen2' | 'screen3';

interface ParticipantInfo {
  fullName: string;
  studentId: string;
  major: string;
  phone: string;
}

interface ResultData {
  isCorrect: boolean;
  durationInSeconds: number;
  backtrackingTime: string;
}

export default function SudokuGamePage() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('screen1');
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>({
    fullName: '',
    studentId: '',
    major: 'CNTT',
    phone: '',
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<ResultData | null>(null);

  // Màn 1 -> Màn 2: Nhận thông tin, bắt đầu tính giờ
  const handleStartGame = (info: ParticipantInfo) => {
    setParticipantInfo(info);
    setStartTime(Date.now());
    setCurrentScreen('screen2');
  };

  // Màn 2: Nộp bài lên Server
  const handleSubmitGame = async (board: number[][]) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: participantInfo.fullName,
          studentId: participantInfo.studentId,
          major: participantInfo.major,
          phone: participantInfo.phone,
          startTime,
          board,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Có lỗi xảy ra khi gửi bài thi!');
        return;
      }

      setResult({
        isCorrect: data.isCorrect,
        durationInSeconds: data.durationInSeconds,
        backtrackingTime: data.backtrackingTime || '0.002',
      });
      setCurrentScreen('screen3');
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Màn 3 -> Chơi lại
  const handlePlayAgain = () => {
    setStartTime(Date.now());
    setCurrentScreen('screen2');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50/50 py-4 sm:py-8 px-3 sm:px-4">
      {currentScreen === 'screen1' && (
        <Screen1Registration onStart={handleStartGame} />
      )}

      {currentScreen === 'screen2' && (
        <Screen2SudokuBoard
          participantInfo={participantInfo}
          startTime={startTime}
          onSubmit={handleSubmitGame}
          onBack={() => setCurrentScreen('screen1')}
          isSubmitting={isSubmitting}
        />
      )}

      {currentScreen === 'screen3' && result && (
        <Screen3Result
          participantInfo={participantInfo}
          result={result}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </main>
  );
}
