import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBoardValid, matchesPuzzle, benchmarkBacktracking, INITIAL_PUZZLE } from '@/lib/sudoku';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, fullName, major, startTime, board } = body;

    // Validate đầu vào
    if (!studentId || !fullName || !major || !startTime || !board) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin!' },
        { status: 400 }
      );
    }

    // Thời gian thực tế thí sinh làm bài (giây)
    const now = Date.now();
    const durationInSeconds = Math.max(1, Math.round((now - Number(startTime)) / 1000));

    // Kiểm tra bài nộp: đúng luật Sudoku VÀ giữ nguyên các ô gợi ý của đề
    const isCorrect = isBoardValid(board) && matchesPuzzle(board);

    // Đo tốc độ giải của thuật toán Backtracking
    const { elapsedSeconds: backtrackingTime } = benchmarkBacktracking(INITIAL_PUZZLE);

    // Lưu / Cập nhật vào cơ sở dữ liệu qua Prisma
    const participant = await prisma.participant.upsert({
      where: { studentId: studentId.trim().toUpperCase() },
      update: {
        fullName: fullName.trim(),
        major: major.trim(),
        durationInSeconds,
        isCorrect,
      },
      create: {
        studentId: studentId.trim().toUpperCase(),
        fullName: fullName.trim(),
        major: major.trim(),
        durationInSeconds,
        isCorrect,
        isGiftClaimed: false,
      },
    });

    // TÍNH TOÁN THỐNG KÊ REAL-TIME TẠI THỜI ĐIỂM HOÀN THÀNH:
    // 1. Tổng số người đã giải đúng
    const totalCorrect = await prisma.participant.count({
      where: { isCorrect: true },
    });

    // 2. Số người giải đúng với thời gian chậm hơn hoặc bằng (để tính % percentile)
    // Người giải càng nhanh thì percentile càng cao (vd: nhanh hơn 95% thí sinh khác)
    let topPercentage = 10; // mặc định nếu là người đầu tiên
    let rank = 1;

    if (totalCorrect > 0) {
      // Đếm số người giải nhanh hơn thí sinh này
      const fasterCount = await prisma.participant.count({
        where: {
          isCorrect: true,
          durationInSeconds: { lt: durationInSeconds },
        },
      });
      rank = fasterCount + 1;

      // Top % xếp hạng: thí sinh nằm trong nhóm Top bao nhiêu %
      // Ví dụ: hạng 1 / 100 người => Top 1%
      // Ví dụ: hạng 5 / 10 người => Top 50%
      const rawTopPercent = Math.max(1, Math.round((rank / totalCorrect) * 100));
      topPercentage = rawTopPercent;
    }

    // 3. Thời gian trung bình của tất cả các bài giải đúng
    const avgAggregate = await prisma.participant.aggregate({
      where: { isCorrect: true },
      _avg: {
        durationInSeconds: true,
      },
    });

    // Nếu chưa có ai hoặc là người đầu tiên, lấy tạm thời gian của thí sinh hoặc mốc tham chiếu 90s
    const avgDuration = avgAggregate._avg.durationInSeconds
      ? Math.round(avgAggregate._avg.durationInSeconds)
      : durationInSeconds;

    return NextResponse.json({
      success: true,
      participantId: participant.id,
      isCorrect,
      durationInSeconds,
      backtrackingTime: backtrackingTime || '0.002',
      rank,
      totalParticipants: totalCorrect,
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
