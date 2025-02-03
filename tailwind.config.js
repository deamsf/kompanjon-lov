/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#254559',
        secondary: '#4B95A6',
        tertiary: '#69B7BF',
        accent: '#F2D3AC',
        highlight: '#D99379',
      },
      fontFamily: {
        display: ['Exo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};