/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#6366f1", light: "#818cf8", dark: "#4f46e5" },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        dark: "#0f172a",
      },
      fontFamily: { sans: ['"PingFang SC"', '"Microsoft YaHei"', "sans-serif"] },
    },
  },
  plugins: [],
};
