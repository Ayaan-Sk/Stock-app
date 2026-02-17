/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          purple: '#bc13fe',
          blue: '#1e40af',
        },
        deep: {
          blue: '#000b1e',
          black: '#000000',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #000000, #000b1e)',
      },
    },
  },
  plugins: [],
}
