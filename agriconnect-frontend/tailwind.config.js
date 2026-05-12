/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#5A3E2B',
        leaf: '#2F7D32',
        grain: '#D4A017',
        sky: '#EAF6FF'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
};
