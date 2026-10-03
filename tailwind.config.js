/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bảng màu xanh chủ đạo TDMU & CLB Sáng tạo số
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#4f9bf0",
          500: "#2179e0",
          600: "#1563c4",
          700: "#0e4fa3",
          800: "#0c3f82",
          900: "#0a2f5f",
        },
      },
      keyframes: {
        // Nháy xanh khi hoàn thành đúng 1 hàng / cột / khối
        flash: {
          "0%": { backgroundColor: "#bbf7d0", color: "#15803d" },
          "50%": { backgroundColor: "#86efac", color: "#14532d" },
          "100%": { backgroundColor: "#ffffff" },
        },
        // Rung nhẹ khi điền số bị trùng
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-3px)" },
          "40%, 80%": { transform: "translateX(3px)" },
        },
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        flash: "flash 0.9s ease-out",
        shake: "shake 0.35s ease-in-out",
        pop: "pop 0.18s ease-out",
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
