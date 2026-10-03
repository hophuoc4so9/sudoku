import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Đảm bảo dữ liệu luôn được làm mới (no cache)
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameType = searchParams.get('gameType') || 'ALL'; // 'ALL', 'SUDOKU', hoặc 'CODE_SPRINT'

    const whereCondition: any = {
      isCorrect: true,
    };

    if (gameType !== 'ALL') {
      whereCondition.gameType = gameType;
    }

    const topParticipants = await prisma.participant.findMany({
      where: whereCondition,
      orderBy: [
        { durationInSeconds: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 50,
      select: {
        id: true,
        studentId: true,
        fullName: true,
        major: true,
        gameType: true,
        durationInSeconds: true,
        isCorrect: true,
        isGiftClaimed: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: topParticipants,
      total: topParticipants.length,
    });
  } catch (error: any) {
    console.error('Lỗi tại /api/leaderboard:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi lấy bảng xếp hạng!' },
      { status: 500 }
    );
  }
}
