/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        player1: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          ring: '#93c5fd'
        },
        player2: {
          light: '#f43f5e',
          DEFAULT: '#e11d48',
          dark: '#be123c',
          ring: '#fda4af'
        }
      }
    },
  },
  plugins: [],
}
