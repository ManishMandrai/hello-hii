/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",   // <-- REQUIRED FIX
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
