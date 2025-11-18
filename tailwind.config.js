/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Sarabun', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          500: '#16a34a',
          600: '#15803d',
          700: '#14532d',
        },
        accent: {
          500: '#eab308',
        }
      },
      animation: {
        'countdown': 'countdown 1s ease-in-out infinite',
      },
      keyframes: {
        countdown: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}