import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { id, isGiftClaimed } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID người tham gia' }, { status: 400 });
    }

    const updated = await prisma.participant.update({
      where: { id },
      data: { isGiftClaimed: Boolean(isGiftClaimed) },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Lỗi khi cập nhật trạng thái quà' },
      { status: 500 }
    );
  }
}
