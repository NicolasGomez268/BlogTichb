/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tichb: {
          black: "#050505",
          panel: "#111111",
          vermilion: "#E34234",
          vermilionLight: "#FF5A4D",
        },
      },
      boxShadow: {
        glow: "0 12px 30px -18px rgba(227, 66, 52, 0.65)",
      },
    },
  },
  plugins: [],
};
