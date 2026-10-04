import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, fullName, phone, major, durationInSeconds, score, totalQuestions } = body;

    if (!studentId || !fullName || !major) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin!' },
        { status: 400 }
      );
    }

    const duration = Math.max(1, Number(durationInSeconds) || 30);
    // Điều kiện đúng: đạt >= passScore (tối thiểu 2 câu đúng)
    const isCorrect = Boolean(score >= 2);

    const participant = await prisma.participant.upsert({
      where: { studentId: studentId.trim().toUpperCase() },
      update: {
        fullName: fullName.trim(),
        phone: phone ? String(phone).trim() : null,
        major: major.trim(),
        gameType: 'CODE_SPRINT',
        durationInSeconds: duration,
        isCorrect,
      },
      create: {
        studentId: studentId.trim().toUpperCase(),
        fullName: fullName.trim(),
        phone: phone ? String(phone).trim() : null,
        major: major.trim(),
        gameType: 'CODE_SPRINT',
        durationInSeconds: duration,
        isCorrect,
        isGiftClaimed: false,
      },
    });

    return NextResponse.json({
      success: true,
      participantId: participant.id,
      isCorrect,
      durationInSeconds: duration,
    });
  } catch (error: any) {
    console.error('Lỗi tại /api/code-sprint:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra khi lưu kết quả!' },
      { status: 500 }
    );
  }
}
