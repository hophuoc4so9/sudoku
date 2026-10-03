/**
 * Cấu hình hệ thống (Config).
 * Hỗ trợ cấu hình qua file biến môi trường local (.env / .env.local).
 * Nếu không config thì fallback về giá trị mặc định cứng (3 câu, đạt 2/3).
 */
export const Config = {
  // Link fanpage CLB
  fanpageUrl:
    process.env.FANPAGE_URL ||
    process.env.NEXT_PUBLIC_FANPAGE_URL ||
    'https://www.facebook.com/CLBSangtaoso/',

  // Code Sprint: Tổng số câu hỏi (mặc định cứng: 3 câu)
  codeSprintTotalQuestions: Number(
    process.env.CODE_SPRINT_TOTAL_QUESTIONS ||
    process.env.NEXT_PUBLIC_CODE_SPRINT_TOTAL_QUESTIONS ||
    3
  ),

  // Code Sprint: Số câu cần đúng tối thiểu để nhận quà (mặc định cứng: 2 câu)
  codeSprintPassScore: Number(
    process.env.CODE_SPRINT_PASS_SCORE ||
    process.env.NEXT_PUBLIC_CODE_SPRINT_PASS_SCORE ||
    2
  ),
};

export const FANPAGE_URL = Config.fanpageUrl;
export const CODE_SPRINT_TOTAL_QUESTIONS = Config.codeSprintTotalQuestions;
export const CODE_SPRINT_PASS_SCORE = Config.codeSprintPassScore;
