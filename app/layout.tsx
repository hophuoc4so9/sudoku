import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thử Thách Sudoku 6x6 | CLB Sáng Tạo Số - TDMU',
  description:
    'Mini-game Sudoku 6x6 chào đón Tân Sinh Viên D26 khối ngành CNTT, KTPM, TTNT - Trường Đại học Thủ Dầu Một.',
  icons: { icon: '/logo_clb.jpg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1563c4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
