/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // tu código dentro de la lib
    "./node_modules/**/src/**/*.{js,jsx,ts,tsx}" // para apps que consuman la lib
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
