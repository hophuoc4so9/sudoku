/**
 * Cấu hình hiển thị, đọc từ ENV (có giá trị mặc định).
 * Lưu ý: biến NEXT_PUBLIC_ được nhúng lúc build -> đổi giá trị trên Vercel thì cần Redeploy.
 */
export const FANPAGE_URL =
  process.env.NEXT_PUBLIC_FANPAGE_URL || 'https://www.facebook.com/CLBSangtaoso/';
