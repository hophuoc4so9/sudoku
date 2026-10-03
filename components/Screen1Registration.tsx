'use client';

import React, { useState } from 'react';
import { User, Hash, Phone, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';

interface Screen1Props {
  onStart: (data: { fullName: string; studentId: string; major: string; phone: string }) => void;
}

const MAJORS = [
  { id: 'CNTT', name: 'Công nghệ Thông tin (CNTT)', color: 'from-blue-600 to-cyan-500' },
  { id: 'KTPM', name: 'Kỹ thuật Phần mềm (KTPM)', color: 'from-sky-600 to-indigo-600' },
  { id: 'TTNT', name: 'Trí tuệ Nhân tạo (TTNT)', color: 'from-cyan-600 to-blue-700' },
];

export const Screen1Registration: React.FC<Screen1Props> = ({ onStart }) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('CNTT');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!studentId.trim()) newErrors.studentId = 'Vui lòng nhập mã số sinh viên';
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập SĐT/Zalo';
    } else if (!/^[0-9]{9,11}$/.test(phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (9-11 số)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onStart({
      fullName: fullName.trim(),
      studentId: studentId.trim().toUpperCase(),
      major,
      phone: phone.trim(),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* CLB & Trường Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-md border border-sky-100 mb-3">
          <img
            src="/logo_clb.jpg"
            alt="CLB Sáng Tạo Số Logo"
            className="w-16 h-16 object-cover rounded-xl"
            onError={(e) => {
              // Fallback nếu logo không tải được
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-wide uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Chào đón Tân Sinh Viên D24 / D25
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          CLB SÁNG TẠO SỐ
        </h1>
        <p className="text-sm font-medium text-sky-700 mt-0.5">
          Trường Đại học Thủ Dầu Một (TDMU)
        </p>
        <p className="text-xs text-slate-500 mt-2 px-4">
          Thử thách tư duy logic & giải thuật Sudoku 6x6. Nhận ngay quà lưu niệm độc quyền tại gian hàng!
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-sky-950/5 border border-sky-100 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Họ và tên thí sinh <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.fullName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50/70 focus:bg-white'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.fullName}</p>}
          </div>

          {/* Mã số sinh viên */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mã số sinh viên (MSSV) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Ví dụ: 2424801030001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm font-medium uppercase tracking-wider transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.studentId ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50/70 focus:bg-white'
                }`}
              />
            </div>
            {errors.studentId && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.studentId}</p>}
          </div>

          {/* Ngành học */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Chuyên ngành <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MAJORS.map((m) => {
                const isSelected = major === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMajor(m.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <span>{m.id}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              {MAJORS.find((m) => m.id === major)?.name}
            </p>
          </div>

          {/* SĐT / Zalo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Số điện thoại / Zalo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="0987654321 (để liên hệ trao giải)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 bg-slate-50/70 focus:bg-white'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>}
          </div>

          {/* Nút bắt đầu to rõ */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-lg shadow-sky-500/30 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>BẮT ĐẦU THỬ THÁCH</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer link to leaderboard */}
      <div className="text-center mt-5">
        <a
          href="/leaderboard"
          className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline underline-offset-4"
        >
          🏆 Xem Bảng Xếp Hạng Trực Tuyến
        </a>
      </div>
    </div>
  );
};
