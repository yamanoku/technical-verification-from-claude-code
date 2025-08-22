/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
    './samples/**/*.{html,js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1e3a8a',
      },
    },
  },
  plugins: [],
};