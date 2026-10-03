'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Timer,
  Trophy,
  ChevronRight,
  HelpCircle,
  Grid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CODE_SPRINT_QUESTIONS,
  parseQuestionSlots,
  generateDistractors,
  CodeSprintQuestion
} from '@/lib/code-sprint';
import { FANPAGE_URL, CODE_SPRINT_TOTAL_QUESTIONS, CODE_SPRINT_PASS_SCORE } from '@/lib/config';

export default function CodeSprintPage() {
  // Screen: 'info' -> 'playing' -> 'result'
  const [screen, setScreen] = useState<'info' | 'playing' | 'result'>('info');

  // Thí sinh
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('CNTT');
  const [formErrors, setFormErrors] = useState<{ fullName?: string; studentId?: string }>({});

  // Trò chơi: đọc từ biến config (mặc định 3 câu, đạt 2/3)
  const [round, setRound] = useState(1);
  const totalRounds = CODE_SPRINT_TOTAL_QUESTIONS;
  const passScore = CODE_SPRINT_PASS_SCORE;
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<CodeSprintQuestion | null>(null);
  const [targetSlotIndex, setTargetSlotIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Chấm câu
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  const [startTime, setStartTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (screen !== 'playing') return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, startTime]);

  // Khởi động câu hỏi mới
  const nextRoundQuestion = (roundNum: number, currentUsedIds: number[]) => {
    // Lọc các câu chưa gặp
    let candidates = CODE_SPRINT_QUESTIONS.filter(q => !currentUsedIds.includes(q.id));
    if (candidates.length === 0) {
      candidates = [...CODE_SPRINT_QUESTIONS];
    }
    const q = candidates[Math.floor(Math.random() * candidates.length)];
    const newUsed = [...currentUsedIds, q.id];
    setUsedQuestionIds(newUsed);
    setCurrentQuestion(q);

    // Parse slots
    const { slots } = parseQuestionSlots(q);
    // Chọn ngẫu nhiên 1 slot làm chỗ trống
    const chosenSlotIdx = Math.floor(Math.random() * slots.length);
    const ans = slots[chosenSlotIdx];
    setTargetSlotIndex(chosenSlotIdx);
    setCorrectAnswer(ans);

    // Sinh các lựa chọn gây nhiễu
    const choiceList = generateDistractors(ans);
    setChoices(choiceList);
    setSelectedChoice(null);
    setIsChecked(false);
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { fullName?: string; studentId?: string } = {};
    if (!fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên';
    if (!studentId.trim()) errors.studentId = 'Vui lòng nhập MSSV';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStartTime(Date.now());
    setRound(1);
    setScore(0);
    setUsedQuestionIds([]);
    nextRoundQuestion(1, []);
    setScreen('playing');
  };

  const handleCheckAnswer = () => {
    if (!selectedChoice) return;
    setIsChecked(true);
    const correct = selectedChoice.trim() === correctAnswer.trim();
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const handleNextRound = () => {
    if (round >= totalRounds) {
      // Kết thúc game: đạt từ 2 câu đúng trở lên là thắng
      const finalScore = score + (isChecked && isCorrect ? 0 : 0);
      if (finalScore >= passScore) {
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#1563c4', '#4f9bf0', '#bfdbfe', '#ffffff'],
          });
        } catch (e) {}
      }
      setScreen('result');
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

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-brand-50 via-white to-white px-4 py-6 flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-md mx-auto w-full mb-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-bold text-xs">
          <Grid className="w-4 h-4" />
          <span>Sang chơi Sudoku 6x6</span>
        </Link>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
          CLB Sáng Tạo Số • D26
        </span>
      </header>

      {/* MÀN 1: ĐIỀN THÔNG TIN */}
      {screen === 'info' && (
        <div className="max-w-md mx-auto w-full animate-fade-up">
          <div className="text-center mb-6">
            <img
              src="/logo_clb.jpg"
              alt="Logo CLB"
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md ring-2 ring-brand-100 mb-3"
            />
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
              Thử thách C++ Lập trình thi đấu
            </span>
            <h1 className="text-2xl font-black text-brand-900 tracking-tight">CODE SPRINT C++</h1>
            <p className="text-xs text-brand-600 font-medium mt-1">Trường Đại học Thủ Dầu Một (TDMU)</p>
            <p className="text-xs text-slate-500 mt-2 px-2">
              Điền đúng chỗ trống trong <strong>{totalRounds} đoạn code C++ ngẫu nhiên</strong>. Trả lời đúng từ <strong>{passScore}/{totalRounds} câu</strong> trở lên để nhận quà độc quyền từ CLB!
            </p>
          </div>

          <form onSubmit={handleStartGame} className="card p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-900 mb-1.5">
                Họ và tên thí sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className={`input-field ${formErrors.fullName ? '!border-red-400 !ring-red-100' : ''}`}
              />
              {formErrors.fullName && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-900 mb-1.5">
                Mã số sinh viên (MSSV) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: 2624802010001"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className={`input-field font-mono uppercase ${formErrors.studentId ? '!border-red-400 !ring-red-100' : ''}`}
              />
              {formErrors.studentId && <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.studentId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-900 mb-1.5">
                Chuyên ngành <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['CNTT', 'KTPM', 'TTNT'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMajor(m)}
                    className={`py-2.5 rounded-xl text-xs font-black border transition ${
                      major === m
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                        : 'bg-white text-brand-800 border-brand-100 hover:border-brand-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2">
              <span>BẮT ĐẦU THỬ THÁCH</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* MÀN 2: CHƠI GAME */}
      {screen === 'playing' && currentQuestion && (
        <div className="max-w-md mx-auto w-full animate-fade-up flex flex-col min-h-[85vh] justify-between">
          <div>
            {/* Top Bar: Thí sinh + Round + Timer */}
            <div className="card p-3 mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-brand-900">{fullName}</p>
                <p className="text-[11px] font-medium text-slate-500">
                  Câu <span className="text-brand-600 font-black">{round}</span>/{totalRounds} • Điểm: {score}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 text-white font-mono font-black text-sm">
                <Timer className="w-4 h-4" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Chủ đề & Tiêu đề câu hỏi */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-brand-100 text-brand-800">
                  {currentQuestion.topic}
                </span>
                <span className="text-xs text-slate-500 font-medium">Chọn đáp án điền vào ô trống</span>
              </div>
              <h2 className="text-base font-black text-slate-900">{currentQuestion.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentQuestion.description}</p>
            </div>

            {/* Khung IDE Code C++ */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 text-slate-100 shadow-xl mb-4 font-mono text-xs">
              <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span>main.cpp (C++)</span>
              </div>

              <div className="p-3.5 overflow-x-auto leading-relaxed">
                <pre className="whitespace-pre font-mono">
                  {(() => {
                    const { renderedParts } = parseQuestionSlots(currentQuestion);
                    return renderedParts.map((p, idx) => {
                      if (!p.isSlot) {
                        return <span key={idx}>{p.text}</span>;
                      }

                      // Slot được chọn làm câu hỏi
                      if (p.slotIndex === targetSlotIndex) {
                        return (
                          <span
                            key={idx}
                            className={`inline-block mx-1 px-2 py-0.5 rounded-lg font-bold border-2 transition ${
                              isChecked
                                ? isCorrect
                                  ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-300'
                                  : 'bg-rose-500 text-white border-rose-400'
                                : selectedChoice
                                ? 'bg-brand-500 text-white border-brand-400 animate-pulse'
                                : 'bg-amber-100 text-amber-900 border-amber-300 animate-bounce'
                            }`}
                          >
                            {selectedChoice ? selectedChoice : '___ ? ___'}
                          </span>
                        );
                      }

                      // Slot khác giữ nguyên code gốc
                      return <span key={idx}>{p.text}</span>;
                    });
                  })()}
                </pre>
              </div>
            </div>

            {/* Các thẻ lựa chọn đáp án */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Chạm vào thẻ đáp án phù hợp:</p>
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
                      className={`p-3 rounded-xl border-2 font-mono text-sm font-bold transition flex items-center justify-center select-none ${btnColor}`}
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
                className={`mt-3 p-3 rounded-xl border text-xs font-bold flex items-center gap-2 animate-fade-up ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Chính xác hoàn toàn! +1 Điểm</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
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
                className="btn-primary !bg-emerald-600 hover:!bg-emerald-700 flex items-center justify-center gap-2"
              >
                <span>{round >= totalRounds ? 'XEM KẾT QUẢ' : 'CÂU TIẾP THEO'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MÀN 3: KẾT QUẢ & NHẬN QUÀ */}
      {screen === 'result' && (
        <div className="max-w-md mx-auto w-full animate-fade-up space-y-4">
          <div className="card p-6 text-center">
            <div className="mb-3">
              {score >= passScore ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                  <HelpCircle className="w-9 h-9" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {score >= passScore ? 'XUẤT SẮC HOÀN THÀNH! 🎉' : 'CẦN CỐ GẮNG THÊM! 😅'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Thí sinh: <strong>{fullName}</strong> ({major})
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-bold text-brand-700 uppercase">Kết quả Code Sprint</p>
              <p className="text-3xl font-black text-brand-900 mt-0.5">
                {score} / {totalRounds} <span className="text-sm font-normal text-slate-500">câu đúng</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Thời gian: {elapsedSeconds} giây</p>
            </div>

            {/* MÃ NHẬN QUÀ - CHỈ HIỆN KHI ĐẠT TỪ 2/3 CÂU ĐÚNG */}
            {score >= passScore ? (
              <div className="mt-4 p-4 rounded-2xl border-2 border-dashed border-brand-300 bg-white">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  🎁 Mã Nhận Quà Tại Gian Hàng
                </p>
                <p className="text-3xl font-black font-mono tracking-widest text-brand-600 mt-1 select-all">
                  {studentId}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Đưa màn hình này cho CTV gian hàng để nhận quà lưu niệm CLB!
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-xl border border-rose-200">
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
            <p className="text-xs text-brand-100 mt-1 leading-relaxed">
              Gia nhập đội tuyển thi đấu Olympic Tin học Sinh viên & ICPC, làm dự án cùng các tiền bối!
            </p>
            <a
              href={FANPAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block rounded-xl bg-white py-2.5 text-center text-xs font-extrabold text-brand-700 hover:bg-brand-50 transition"
            >
              Theo dõi Fanpage CLB
            </a>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStartTime(Date.now());
                setRound(1);
                setScore(0);
                setUsedQuestionIds([]);
                nextRoundQuestion(1, []);
                setScreen('playing');
              }}
              className="flex-1 py-3.5 rounded-2xl border-2 border-brand-100 bg-white font-bold text-xs text-brand-700 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại Code Sprint</span>
            </button>
            <Link
              href="/"
              className="flex-1 py-3.5 rounded-2xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/20"
            >
              <Grid className="w-4 h-4" />
              <span>Sang giải Sudoku</span>
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-6 text-center text-[11px] text-slate-400">
        © CLB Sáng Tạo Số — Trường Đại học Thủ Dầu Một (TDMU)
      </footer>
    </div>
  );
}
