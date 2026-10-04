import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBoardValid, matchesPuzzle, benchmarkBacktracking } from '@/lib/sudoku';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, fullName, phone, major, startTime, board, initialPuzzle } = body;

    // Validate đầu vào
    if (!studentId || !fullName || !major || !startTime || !board || !initialPuzzle) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin!' },
        { status: 400 }
      );
    }

    // Thời gian thực tế thí sinh làm bài (giây)
    const now = Date.now();
    const durationInSeconds = Math.max(1, Math.round((now - Number(startTime)) / 1000));

    // Kiểm tra tính hợp lệ của bài nộp:
    // 1. Phải thỏa mãn luật Sudoku 6x6
    // 2. Phải giữ nguyên các ô gợi ý gốc của đề được giao cho thí sinh đó
    const isCorrect = isBoardValid(board) && matchesPuzzle(board, initialPuzzle);

    // Đo tốc độ giải của thuật toán Backtracking trên chính đề của thí sinh
    const { elapsedSeconds: backtrackingTime } = benchmarkBacktracking(initialPuzzle);

    const gameType = body.gameType || 'SUDOKU';

    // Lưu / Cập nhật vào cơ sở dữ liệu qua Prisma
    const participant = await prisma.participant.upsert({
      where: { studentId: studentId.trim().toUpperCase() },
      update: {
        fullName: fullName.trim(),
        phone: phone ? String(phone).trim() : null,
        major: major.trim(),
        gameType,
        durationInSeconds,
        isCorrect,
      },
      create: {
        studentId: studentId.trim().toUpperCase(),
        fullName: fullName.trim(),
        phone: phone ? String(phone).trim() : null,
        major: major.trim(),
        gameType,
        durationInSeconds,
        isCorrect,
        isGiftClaimed: false,
      },
    });

    // TÍNH TOÁN THỐNG KÊ REAL-TIME TẠI THỜI ĐIỂM HOÀN THÀNH (theo gameType):
    // 1. Tổng số người đã giải đúng môn này
    const totalCorrect = await prisma.participant.count({
      where: { gameType, isCorrect: true },
    });

    // 2. Tính Top % xếp hạng
    let topPercentage = 10;
    let rank = 1;

    if (totalCorrect > 0) {
      const fasterCount = await prisma.participant.count({
        where: {
          gameType,
          isCorrect: true,
          durationInSeconds: { lt: durationInSeconds },
        },
      });
      rank = fasterCount + 1;
      topPercentage = Math.max(1, Math.round((rank / totalCorrect) * 100));
    }

    // 3. Thời gian trung bình của tất cả các bài giải đúng môn này
    const avgAggregate = await prisma.participant.aggregate({
      where: { gameType, isCorrect: true },
      _avg: {
        durationInSeconds: true,
      },
    });

    const avgDuration = avgAggregate._avg.durationInSeconds
      ? Math.round(avgAggregate._avg.durationInSeconds)
      : durationInSeconds;

    return NextResponse.json({
      success: true,
      participantId: participant.id,
      isCorrect,
      durationInSeconds,
      backtrackingTime: backtrackingTime || '0.002',
      topPercentage,
      averageDurationInSeconds: avgDuration,
    });
  } catch (error: any) {
    console.error('Lỗi tại /api/submit:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi lưu kết quả bài thi!' },
      { status: 500 }
    );
  }
}
