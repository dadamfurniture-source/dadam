/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a7dff',
        secondary: '#f59e0b',
        success: '#00c853',
        danger: '#ff4d4f',
        upper: '#5b8def',
        lower: '#f59e0b',
        tall: '#10b981',
      },
    },
  },
  plugins: [],
};
