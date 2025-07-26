/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      colors: {
        "bg-color": "#f4f4f5",
        "bg-secondary": "#e5e7eb",
        "p-orange": "#ea580c",
        "s-orange": "#c2410c",
        "p-red": "#ef4444",
        "p-gray": "#334155",
        "p-green": "#2ecc71",
        "text-color": "#1a1a1a",
        "text-white": "#ffffff",
      },
    },
  },
  plugins: [],
};
