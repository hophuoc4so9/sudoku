import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Đảm bảo dữ liệu luôn được làm mới (no cache)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topParticipants = await prisma.participant.findMany({
      where: {
        isCorrect: true,
      },
      orderBy: [
        { durationInSeconds: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 20,
      select: {
        id: true,
        studentId: true,
        fullName: true,
        major: true,
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
