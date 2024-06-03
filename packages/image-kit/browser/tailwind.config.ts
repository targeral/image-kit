import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [path.join(__dirname, './**/*.{html,js,ts,jsx,tsx}')],
  theme: {
    extend: {},
  },
  plugins: [],
};
