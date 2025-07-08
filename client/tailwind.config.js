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
        "bg-color": "#f8f9fa",
        "p-green": "#2ecc71",
        "s-green": "#27ae60",
        "p-red": "#e74c3c",
        "p-gray": "#34495e",
      },
    },
  },
  plugins: [],
};
