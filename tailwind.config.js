/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-cormorant)', 'serif'],
        serif: ['var(--font-playfair)', 'serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
      colors: {
        terrakotta: '#E56A5B',
        blush: '#F6D7CE',
        salbei: '#A8BDAF',
        lavendel: '#C8B6D9',
        sand: '#F2ECE4',
        gold: '#D4AF37',
        anthrazit: '#2B2B2B',
        brand: {
          50:  '#F6D7CE',
          100: '#F6D7CE',
          200: '#F0A090',
          500: '#E56A5B',
          600: '#c9574a',
          700: '#a8443a',
        },
      },
    },
  },
  plugins: [],
}
