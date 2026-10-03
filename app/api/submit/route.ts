import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBoardValid, benchmarkBacktracking, INITIAL_PUZZLE } from '@/lib/sudoku';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, fullName, major, phone, startTime, board } = body;

    // Validate đầu vào
    if (!studentId || !fullName || !major || !phone || !startTime || !board) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin!' },
        { status: 400 }
      );
    }

    // Tính thời gian hoàn thành (giây)
    const now = Date.now();
    const durationInSeconds = Math.max(1, Math.round((now - Number(startTime)) / 1000));

    // Kiểm tra tính hợp lệ của bài nộp
    const isCorrect = isBoardValid(board);

    // Đo tốc độ giải của thuật toán Backtracking
    const { elapsedSeconds: backtrackingTime } = benchmarkBacktracking(INITIAL_PUZZLE);

    // Lưu / Cập nhật vào cơ sở dữ liệu qua Prisma
    // Dùng upsert theo studentId: nếu đã thi thì cập nhật kết quả tốt nhất hoặc ghi nhận bài nộp mới nhất
    const participant = await prisma.participant.upsert({
      where: { studentId: studentId.trim().toUpperCase() },
      update: {
        fullName: fullName.trim(),
        major: major.trim(),
        phone: phone.trim(),
        durationInSeconds,
        isCorrect,
      },
      create: {
        studentId: studentId.trim().toUpperCase(),
        fullName: fullName.trim(),
        major: major.trim(),
        phone: phone.trim(),
        durationInSeconds,
        isCorrect,
        isGiftClaimed: false,
      },
    });

    return NextResponse.json({
      success: true,
      participantId: participant.id,
      isCorrect,
      durationInSeconds,
      backtrackingTime: backtrackingTime || '0.002',
    });
  } catch (error: any) {
    console.error('Lỗi tại /api/submit:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi lưu kết quả bài thi!' },
      { status: 500 }
    );
  }
}
