/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
