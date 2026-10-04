'use client';

import React, { useState } from 'react';
import { ArrowRight, Grid, Code2 } from 'lucide-react';

export interface ParticipantInfo {
  fullName: string;
  studentId: string;
  phone: string;
  major: string;
  selectedGame: 'SUDOKU' | 'CODE_SPRINT';
}

interface Screen1Props {
  onStart: (data: ParticipantInfo) => void;
  initialGame?: 'SUDOKU' | 'CODE_SPRINT';
}

const MAJORS = [
  { id: 'CNTT', name: 'Công nghệ thông tin' },
  { id: 'KTPM', name: 'Kỹ thuật phần mềm' },
  { id: 'TTNT', name: 'Trí tuệ nhân tạo' },
  { id: 'KHAC', name: 'Ngành khác' },
];

export const SharedRegistrationForm: React.FC<Screen1Props> = ({
  onStart,
  initialGame = 'SUDOKU',
}) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [major, setMajor] = useState('CNTT');
  const [selectedGame, setSelectedGame] = useState<'SUDOKU' | 'CODE_SPRINT'>(initialGame);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Vui lòng nhập họ và tên';
    if (!studentId.trim()) next.studentId = 'Vui lòng nhập mã số sinh viên';
    if (!phone.trim()) {
      next.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(phone.trim().replace(/\s+/g, ''))) {
      next.phone = 'Số điện thoại không hợp lệ (9 - 11 chữ số)';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    onStart({
      fullName: fullName.trim(),
      studentId: studentId.trim().toUpperCase(),
      phone: phone.trim().replace(/\s+/g, ''),
      major,
      selectedGame,
    });
  };

  return (
    <div className="mx-auto w-full max-w-md animate-fade-up">
      {/* Header đồng nhất */}
      <header className="mb-5 flex flex-col items-center text-center">
        <img
          src="/logo_clb.jpg"
          alt="Logo CLB Sáng Tạo Số"
          className="mb-3 h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg shadow-brand-600/20 ring-2 ring-brand-100"
        />
        <span className="mb-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
          Chào đón Tân Sinh Viên D26
        </span>
        <h1 className="text-[24px] font-black leading-tight tracking-tight text-brand-800">
          CLB SÁNG TẠO SỐ
        </h1>
        <p className="mt-0.5 text-xs font-semibold text-brand-500">Trường Đại học Thủ Dầu Một (TDMU)</p>
      </header>

      {/* CHỌN 1 TRONG 2 MÔN THI ĐẤU (Bấm đổi môn ngay tại chỗ, KHÔNG đổi URL) */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 text-center">
          Chọn môn thử thách để nhận quà gian hàng
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Nút Môn 1: Sudoku */}
          <button
            type="button"
            onClick={() => setSelectedGame('SUDOKU')}
            className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition active:scale-95 shadow-sm relative overflow-hidden ${
              selectedGame === 'SUDOKU'
                ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-brand-600/10'
                : 'border-slate-200 bg-white hover:border-brand-300 text-slate-700'
            }`}
          >
            {selectedGame === 'SUDOKU' && (
              <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-brand-600 text-white">
                Đang chọn
              </span>
            )}
            <div
              className={`p-2 rounded-xl shadow-sm mb-1.5 transition ${
                selectedGame === 'SUDOKU' ? 'bg-white text-brand-600' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </div>
            <p className="text-xs font-black">Sudoku 6x6</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Tư duy logic & giải thuật</p>
          </button>

          {/* Nút Môn 2: Code Sprint C++ */}
          <button
            type="button"
            onClick={() => setSelectedGame('CODE_SPRINT')}
            className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition active:scale-95 shadow-sm relative overflow-hidden ${
              selectedGame === 'CODE_SPRINT'
                ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-brand-600/10'
                : 'border-slate-200 bg-white hover:border-brand-300 text-slate-700'
            }`}
          >
            {selectedGame === 'CODE_SPRINT' && (
              <span className="absolute top-2 right-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-brand-600 text-white">
                Đang chọn
              </span>
            )}
            <div
              className={`p-2 rounded-xl shadow-sm mb-1.5 transition ${
                selectedGame === 'CODE_SPRINT' ? 'bg-white text-brand-600' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <Code2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-black">Code Sprint C++</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">3 câu điền code C++</p>
          </button>
        </div>
      </div>

      {/* FORM NHẬP THÔNG TIN */}
      <form onSubmit={handleSubmit} className="card space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-900">
            Họ và tên thí sinh <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`input-field ${errors.fullName ? '!border-red-400 !ring-red-100' : ''}`}
          />
          {errors.fullName && <p className="mt-1 text-xs font-medium text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-900">
            Mã số sinh viên (MSSV) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="VD: 2624802010001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className={`input-field font-mono uppercase tracking-wider ${errors.studentId ? '!border-red-400 !ring-red-100' : ''}`}
          />
          {errors.studentId && <p className="mt-1 text-xs font-medium text-red-500">{errors.studentId}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-900">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="VD: 0912345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`input-field font-mono ${errors.phone ? '!border-red-400 !ring-red-100' : ''}`}
          />
          {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
        </div>

        {/* CHUYÊN NGÀNH: CNTT, KTPM, TTNT, VÀ NGÀNH KHÁC */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-900">
            Chuyên ngành <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {MAJORS.map((m) => {
              const active = major === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMajor(m.id)}
                  className={`rounded-xl border-2 px-1 py-2 text-center transition active:scale-95 ${
                    active
                      ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25'
                      : 'border-brand-100 bg-white text-brand-800 hover:border-brand-300'
                  }`}
                >
                  <div className="text-xs font-black">{m.id}</div>
                  <div className={`mt-0.5 text-[9px] truncate leading-tight ${active ? 'text-brand-100' : 'text-slate-400'}`}>
                    {m.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2 pt-3.5 pb-3.5">
          <span>
            {selectedGame === 'SUDOKU' ? 'BẮT ĐẦU GIẢI SUDOKU 6X6' : 'BẮT ĐẦU CODE SPRINT C++'}
          </span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {/* FOOTER: ẨN HOÀN TOÀN LINK LEADERBOARD CHO THÍ SINH (Chỉ CTV biết link /leaderboard mới vào) */}
      <div className="mt-5 text-center">
        <p className="text-[11px] text-slate-400">© CLB Sáng Tạo Số — Trường Đại học Thủ Dầu Một (TDMU)</p>
      </div>
    </div>
  );
};

// Giữ lại export cũ cho tương thích
export const Screen1Registration = SharedRegistrationForm;
