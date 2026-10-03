import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thử Thách Sudoku 6x6 | CLB Sáng Tạo Số - TDMU',
  description: 'Mini-game logic Sudoku 6x6 chào đón Tân Sinh Viên khối ngành CNTT, KTPM, TTNT Trường Đại học Thủ Dầu Một (TDMU).',
  icons: {
    icon: '/logo_clb.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-sky-200 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
