/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#29231B',
        paper: '#FAF6EE',
        cream: '#FFFDF7',
        moss: { DEFAULT: '#3E6B34', dark: '#2F5228', light: '#EAF0E2' },
        ochre: { DEFAULT: '#D98E2B', light: '#FBEDD3' },
        clay: '#C4522E',
        warmline: '#E7DCC8',
        mutedink: '#7A6F5E',
      },
      boxShadow: {
        card: '0 1px 2px rgba(41,35,27,.05), 0 10px 30px -18px rgba(41,35,27,.25)',
        lift: '0 2px 4px rgba(41,35,27,.06), 0 18px 38px -18px rgba(41,35,27,.32)',
      },
    },
  },
  plugins: [],
}
