/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'base': ['Archivo', 'sans-serif'],
        'header': ['Clash Display', 'sans-serif']
      },

      colors: {
        'ec-orange': 'hsl(26, 100%, 55%)',
        'ec-pale-orange': 'hsl(25, 100%, 94%)',
        'ec-very-dark-blue': 'hsl(220, 13%, 13%)',
        'ec-dark-gray-blue': 'hsl(219, 9%, 45%)',
        'ec-gray-blue': 'hsl(220, 14%, 75%)',
        'ec-light-gray-blue': 'hsl(223, 64%, 98%)',
      }
    },
  },
  plugins: [],
}