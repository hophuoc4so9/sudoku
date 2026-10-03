import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CODE_SPRINT_QUESTIONS } from '@/lib/code-sprint';

// GET: Lấy danh sách câu hỏi từ database.
// Nếu database chưa có câu hỏi nào, tự động seed 20 câu hỏi mặc định lên Neon DB.
export async function GET() {
  try {
    let count = await prisma.codeQuestion.count();

    if (count === 0) {
      // Tự động seed dữ liệu
      await prisma.codeQuestion.createMany({
        data: CODE_SPRINT_QUESTIONS.map((q) => ({
          id: q.id,
          title: q.title,
          topic: q.topic,
          description: q.description,
          code: q.code,
          correctAnswer: q.correctAnswer,
          options: q.options,
        })),
        skipDuplicates: true,
      });

      // Đồng bộ sequence Postgres ID cho autoincrement
      try {
        await prisma.$executeRawUnsafe(
          `SELECT setval(pg_get_serial_sequence('"CodeQuestion"', 'id'), coalesce(max(id), 0) + 1, false) FROM "CodeQuestion";`
        );
      } catch (seqErr) {
        console.warn('Lưu ý đồng bộ sequence ID:', seqErr);
      }
    }

    const questions = await prisma.codeQuestion.findMany({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error: any) {
    console.error('Lỗi khi lấy danh sách câu hỏi C++:', error);
    // Nếu kết nối DB lỗi, trả về danh sách fallback từ file tĩnh để game không bị ngắt quãng
    return NextResponse.json({
      success: false,
      fallback: true,
      error: error?.message || 'Lỗi kết nối cơ sở dữ liệu',
      questions: CODE_SPRINT_QUESTIONS,
    });
  }
}

// POST: Hỗ trợ seed cưỡng bức hoặc thêm câu hỏi mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { forceSeed, question } = body;

    if (forceSeed) {
      for (const q of CODE_SPRINT_QUESTIONS) {
        await prisma.codeQuestion.upsert({
          where: { id: q.id },
          update: {
            title: q.title,
            topic: q.topic,
            description: q.description,
            code: q.code,
            correctAnswer: q.correctAnswer,
            options: q.options,
          },
          create: {
            id: q.id,
            title: q.title,
            topic: q.topic,
            description: q.description,
            code: q.code,
            correctAnswer: q.correctAnswer,
            options: q.options,
          },
        });
      }

      const total = await prisma.codeQuestion.count();
      return NextResponse.json({
        success: true,
        message: `Đã seed thành công ${total} câu hỏi vào database!`,
      });
    }

    if (question && question.title && question.code) {
      const created = await prisma.codeQuestion.create({
        data: {
          title: question.title,
          topic: question.topic || 'Cơ bản',
          description: question.description || '',
          code: question.code,
          correctAnswer: question.correctAnswer || '',
          options: Array.isArray(question.options) ? question.options : [],
        },
      });

      return NextResponse.json({
        success: true,
        question: created,
      });
    }

    return NextResponse.json(
      { error: 'Yêu cầu không hợp lệ. Gửi forceSeed: true để nạp lại dữ liệu.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Lỗi tại POST /api/code-questions:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra!' },
      { status: 500 }
    );
  }
}
