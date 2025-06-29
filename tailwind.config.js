/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: { 400: '#00D4FF' },
        purple: { 400: '#8B5CF6' },
        blue: { 400: '#0EA5E9', 950: '#0369A1' },
        charcoal: '#1E293B',
        white: '#FFFFFF',
        black: '#000000'
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.10)",
      },
      backdropBlur: {
        xl: '30px'
      }
    },
  },
  plugins: [],
}
