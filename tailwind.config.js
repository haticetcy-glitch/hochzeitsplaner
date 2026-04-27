/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          50:  '#FAE8E1',
          100: '#F5C4B3',
          200: '#F0997B',
          500: '#B45A30',
          600: '#993C1D',
          700: '#712B13',
        },
      },
    },
  },
  plugins: [],
}
