'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface ParticipantInfo {
  fullName: string;
  studentId: string;
  major: string;
}

interface Screen1Props {
  onStart: (data: ParticipantInfo) => void;
}

const MAJORS = [
  { id: 'CNTT', name: 'Công nghệ thông tin' },
  { id: 'KTPM', name: 'Kỹ thuật phần mềm' },
  { id: 'TTNT', name: 'Trí tuệ nhân tạo' },
];

export const Screen1Registration: React.FC<Screen1Props> = ({ onStart }) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('CNTT');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Vui lòng nhập họ và tên';
    if (!studentId.trim()) next.studentId = 'Vui lòng nhập mã số sinh viên';
    setErrors(next);
    if (Object.keys(next).length) return;

    onStart({
      fullName: fullName.trim(),
      studentId: studentId.trim().toUpperCase(),
      major,
    });
  };

  return (
    <div className="mx-auto w-full max-w-md animate-fade-up">
      {/* Header: logo căn giữa, thông tin bên dưới */}
      <header className="mb-6 flex flex-col items-center text-center">
        <img
          src="/logo_clb.jpg"
          alt="Logo CLB Sáng Tạo Số"
          className="mb-4 h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg shadow-brand-600/20 ring-2 ring-brand-100"
        />
        <span className="mb-3 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
          Chào đón Tân Sinh Viên D26
        </span>
        <h1 className="text-[26px] font-black leading-tight tracking-tight text-brand-800">
          CLB SÁNG TẠO SỐ
        </h1>
        <p className="mt-1 text-sm font-semibold text-brand-500">Trường Đại học Thủ Dầu Một</p>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
          Giải Sudoku 6x6 nhanh nhất có thể để nhận quà tại gian hàng CLB!
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-900">Họ và tên</label>
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
          <label className="mb-1.5 block text-sm font-bold text-brand-900">Mã số sinh viên</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="VD: 2624802010001"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className={`input-field font-mono tracking-wider ${errors.studentId ? '!border-red-400 !ring-red-100' : ''}`}
          />
          {errors.studentId && <p className="mt-1 text-xs font-medium text-red-500">{errors.studentId}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-brand-900">Ngành học</label>
          <div className="grid grid-cols-3 gap-2">
            {MAJORS.map((m) => {
              const active = major === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMajor(m.id)}
                  className={`rounded-xl border-2 px-1 py-2.5 text-center transition active:scale-95 ${
                    active
                      ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25'
                      : 'border-brand-100 bg-white text-brand-800 hover:border-brand-300'
                  }`}
                >
                  <div className="text-sm font-black">{m.id}</div>
                  <div className={`mt-0.5 text-[10px] leading-tight ${active ? 'text-brand-100' : 'text-slate-400'}`}>
                    {m.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center justify-center gap-2">
          BẮT ĐẦU THỬ THÁCH
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      {/* Luật chơi ngắn gọn */}
      <div className="mt-5 rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-brand-800">
        <p className="mb-1 font-bold">📌 Luật chơi</p>
        Điền số từ <b>1 đến 6</b> sao cho mỗi <b>hàng</b>, mỗi <b>cột</b> và mỗi <b>khối 2×3</b> đều không có số trùng nhau.
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-400">© CLB Sáng Tạo Số — TDMU</p>
    </div>
  );
};
