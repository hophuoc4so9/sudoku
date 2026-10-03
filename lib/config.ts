/**
 * Cấu hình hệ thống (Private config).
 * Link fanpage CLB: có thể cấu hình qua biến FANPAGE_URL (hoặc NEXT_PUBLIC_FANPAGE_URL), mặc định là link chính thức của CLB.
 */
export const Config = {
  fanpageUrl:
    process.env.FANPAGE_URL ||
    process.env.NEXT_PUBLIC_FANPAGE_URL ||
    'https://www.facebook.com/CLBSangtaoso/',
};

// Export tiện lợi
export const FANPAGE_URL = Config.fanpageUrl;
