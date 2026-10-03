/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tdmu: {
          blue: "#0284c7",
          darkblue: "#0369a1",
          navy: "#0f172a",
          teal: "#0d9488",
          primary: "#0066b2",
          secondary: "#0284c7",
          light: "#e0f2fe",
          accent: "#38bdf8",
        },
      },
    },
  },
  plugins: [],
};
