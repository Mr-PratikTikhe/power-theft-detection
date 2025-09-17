/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      boxShadow: {
        'neon-blue': '0 0 5px theme("colors.blue.400"), 0 0 20px theme("colors.blue.600")',
        'neon-green': '0 0 5px theme("colors.green.400"), 0 0 20px theme("colors.green.600")',
        'neon-red': '0 0 5px theme("colors.red.400"), 0 0 20px theme("colors.red.600")',
      },
    },
  },
  plugins: [],
}
