'use client';

import React, { useState, useEffect } from 'react';
import {
  Timer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Gift,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CODE_SPRINT_QUESTIONS,
  parseQuestionSlots,
  generateDistractors,
  CodeSprintQuestion,
} from '@/lib/code-sprint';
import { FANPAGE_URL, CODE_SPRINT_TOTAL_QUESTIONS, CODE_SPRINT_PASS_SCORE } from '@/lib/config';
import type { ParticipantInfo } from './Screen1Registration';

interface CodeSprintGameProps {
  participantInfo: ParticipantInfo;
  startTime: number;
  onBack: () => void;
  onPlayAgain: () => void;
}

export const CodeSprintGame: React.FC<CodeSprintGameProps> = ({
  participantInfo,
  startTime,
  onBack,
  onPlayAgain,
}) => {
  const [screenState, setScreenState] = useState<'playing' | 'result'>('playing');

  const totalRounds = CODE_SPRINT_TOTAL_QUESTIONS;
  const passScore = CODE_SPRINT_PASS_SCORE;

  const [round, setRound] = useState(1);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<CodeSprintQuestion | null>(null);
  const [targetSlotIndex, setTargetSlotIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const [questionPool, setQuestionPool] = useState<CodeSprintQuestion[]>(CODE_SPRINT_QUESTIONS);
  const questionPoolRef = React.useRef<CodeSprintQuestion[]>(CODE_SPRINT_QUESTIONS);

  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/code-questions')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          questionPoolRef.current = data.questions;
          setQuestionPool(data.questions);
        }
      })
      .catch((err) => {
        console.warn('Lỗi tải câu hỏi từ DB, dùng câu hỏi mặc định:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (screenState !== 'playing') return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [screenState, startTime]);

  const nextRoundQuestion = (roundNum: number, currentUsedIds: number[]) => {
    const pool = questionPoolRef.current.length > 0 ? questionPoolRef.current : CODE_SPRINT_QUESTIONS;
    let candidates = pool.filter((q) => !currentUsedIds.includes(q.id));
    if (candidates.length === 0) {
      candidates = [...pool];
    }
    const q = candidates[Math.floor(Math.random() * candidates.length)];
    const newUsed = [...currentUsedIds, q.id];
    setUsedQuestionIds(newUsed);
    setCurrentQuestion(q);

    const { slots } = parseQuestionSlots(q);
    const chosenSlotIdx = slots.length > 0 ? Math.floor(Math.random() * slots.length) : 0;
    const ans = slots[chosenSlotIdx] || q.correctAnswer || '';
    setTargetSlotIndex(chosenSlotIdx);

    if (q.correctAnswer && Array.isArray(q.options) && q.options.length > 0) {
      setCorrectAnswer(q.correctAnswer);
      setChoices([...q.options].sort(() => Math.random() - 0.5));
    } else {
      setCorrectAnswer(ans);
      const choiceList = generateDistractors(ans);
      setChoices(choiceList);
    }

    setSelectedChoice(null);
    setIsChecked(false);
  };

  useEffect(() => {
    nextRoundQuestion(1, []);
  }, []);

  const handleCheckAnswer = () => {
    if (!selectedChoice) return;
    setIsChecked(true);
    const correct = selectedChoice.trim() === correctAnswer.trim();
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNextRound = () => {
    if (round >= totalRounds) {
      const finalScore = score + (isChecked && isCorrect ? 0 : 0);
      const isWin = finalScore >= passScore;

      // Lưu kết quả vào PostgreSQL
      try {
        fetch('/api/code-sprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: participantInfo.studentId,
            fullName: participantInfo.fullName,
            major: participantInfo.major,
            durationInSeconds: elapsedSeconds,
            score: finalScore,
            totalQuestions: totalRounds,
          }),
        }).catch(() => {});
      } catch (e) {}

      if (isWin) {
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#1563c4', '#4f9bf0', '#bfdbfe', '#ffffff'],
          });
        } catch (e) {}
      }
      setScreenState('result');
      return;
    }

    const nextR = round + 1;
    setRound(nextR);
    nextRoundQuestion(nextR, usedQuestionIds);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (screenState === 'result') {
    return (
      <div className="mx-auto w-full max-w-md animate-fade-up space-y-4">
        <div className="card p-6 text-center">
          <div className="mb-3">
            {score >= passScore ? (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-9 w-9" />
              </div>
            ) : (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                <HelpCircle className="h-9 w-9" />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            {score >= passScore ? 'XUẤT SẮC HOÀN THÀNH! 🎉' : 'CẦN CỐ GẮNG THÊM! 😅'}
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Thí sinh: <strong>{participantInfo.fullName}</strong> ({participantInfo.major})
          </p>

          <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-xs font-bold uppercase text-brand-700">Kết quả Code Sprint C++</p>
            <p className="mt-0.5 text-3xl font-black text-brand-900">
              {score} / {totalRounds} <span className="text-sm font-normal text-slate-500">câu đúng</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Thời gian: {elapsedSeconds} giây</p>
          </div>

          {score >= passScore ? (
            <div className="mt-4 rounded-2xl border-2 border-dashed border-brand-300 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                🎁 Mã Nhận Quà Tại Gian Hàng
              </p>
              <p className="mt-1 select-all font-mono text-3xl font-black tracking-widest text-brand-600">
                {participantInfo.studentId}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Đưa màn hình này cho CTV gian hàng để nhận quà lưu niệm CLB!
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600">
              Bạn cần đạt từ {passScore}/{totalRounds} câu đúng trở lên để nhận mã quà. Hãy thử sức lại nhé!
            </p>
          )}
        </div>

        {/* Thẻ CLB */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-xl shadow-brand-700/20">
          <div className="mb-3 flex items-center gap-3">
            <img src="/logo_clb.jpg" alt="CLB" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
            <div>
              <p className="text-base font-black leading-tight">CLB Sáng Tạo Số</p>
              <p className="text-[11px] text-brand-100">Trường Đại học Thủ Dầu Một</p>
            </div>
          </div>
          <p className="text-sm font-semibold">Đam mê Lập trình C++ & Giải thuật?</p>
          <p className="mt-1 text-xs leading-relaxed text-brand-100">
            Gia nhập đội tuyển thi đấu Olympic Tin học Sinh viên & ICPC, làm dự án cùng các tiền bối!
          </p>
          <a
            href={FANPAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-xl bg-white py-2.5 text-center text-xs font-extrabold text-brand-700 transition hover:bg-brand-50"
          >
            Theo dõi Fanpage CLB
          </a>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-brand-100 bg-white py-3.5 text-xs font-bold text-brand-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Chơi lại</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-600 py-3.5 text-xs font-bold text-white shadow-md shadow-brand-600/20"
          >
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="mx-auto flex min-h-[85vh] w-full max-w-md flex-col justify-between animate-fade-up">
      <div>
        {/* Top Bar: Thí sinh + Round + Timer */}
        <div className="card mb-3 flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="rounded-xl p-1.5 text-brand-700 transition hover:bg-brand-50"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-bold text-brand-900">{participantInfo.fullName}</p>
              <p className="text-[11px] font-medium text-slate-500">
                Câu <span className="font-black text-brand-600">{round}</span>/{totalRounds} • Điểm: {score}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 font-mono text-sm font-black text-white">
            <Timer className="h-4 w-4" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Chủ đề & Tiêu đề câu hỏi */}
        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="rounded-lg bg-brand-100 px-2.5 py-0.5 text-[11px] font-bold text-brand-800">
              {currentQuestion.topic}
            </span>
            <span className="text-xs font-medium text-slate-500">Chọn đáp án điền vào ô trống</span>
          </div>
          <h2 className="text-base font-black text-slate-900">{currentQuestion.title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{currentQuestion.description}</p>
        </div>

        {/* Khung IDE Code C++ */}
        <div className="mb-4 overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900 font-mono text-xs text-slate-100 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-3 py-2 text-[11px] text-slate-400">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <span>main.cpp (C++)</span>
          </div>

          <div className="overflow-x-auto p-3.5 leading-relaxed">
            <pre className="whitespace-pre font-mono">
              {(() => {
                const { renderedParts } = parseQuestionSlots(currentQuestion);
                return renderedParts.map((p, idx) => {
                  if (!p.isSlot) {
                    return <span key={idx}>{p.text}</span>;
                  }

                  if (p.slotIndex === targetSlotIndex) {
                    return (
                      <span
                        key={idx}
                        className={`mx-1 inline-block rounded-lg border-2 px-2 py-0.5 font-bold transition ${
                          isChecked
                            ? isCorrect
                              ? 'border-emerald-400 bg-emerald-500 text-white ring-2 ring-emerald-300'
                              : 'border-rose-400 bg-rose-500 text-white'
                            : selectedChoice
                            ? 'animate-pulse border-brand-400 bg-brand-500 text-white'
                            : 'animate-bounce border-amber-300 bg-amber-100 text-amber-900'
                        }`}
                      >
                        {selectedChoice ? selectedChoice : '___ ? ___'}
                      </span>
                    );
                  }

                  return <span key={idx}>{p.text}</span>;
                });
              })()}
            </pre>
          </div>
        </div>

        {/* Các thẻ lựa chọn đáp án */}
        <div>
          <p className="mb-2 text-xs font-bold text-slate-700">Chạm vào thẻ đáp án phù hợp:</p>
          <div className="grid grid-cols-2 gap-2">
            {choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice;
              let btnColor = 'bg-white text-slate-800 border-slate-200 hover:border-brand-400';
              if (isSelected) {
                btnColor = 'bg-brand-600 text-white border-brand-600 shadow-md';
              }
              if (isChecked) {
                if (choice === correctAnswer) {
                  btnColor = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isCorrect) {
                  btnColor = 'bg-rose-600 text-white border-rose-600';
                } else {
                  btnColor = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isChecked}
                  onClick={() => setSelectedChoice(choice)}
                  className={`flex select-none items-center justify-center rounded-xl border-2 p-3 font-mono text-sm font-bold transition ${btnColor}`}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phản hồi đáp án */}
        {isChecked && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl border p-3 text-xs font-bold animate-fade-up ${
              isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Chính xác hoàn toàn! +1 Điểm</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-rose-600" />
                <span>Chưa đúng rồi! Đáp án đúng là: {correctAnswer}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Nút hành động */}
      <div className="pt-4">
        {!isChecked ? (
          <button
            type="button"
            disabled={!selectedChoice}
            onClick={handleCheckAnswer}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <span>KIỂM TRA ĐÁP ÁN</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextRound}
            className="btn-primary flex items-center justify-center gap-2 !bg-emerald-600 hover:!bg-emerald-700"
          >
            <span>{round >= totalRounds ? 'XEM KẾT QUẢ' : 'CÂU TIẾP THEO'}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
