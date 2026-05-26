/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // tu código dentro de la lib
    "./node_modules/**/src/**/*.{js,jsx,ts,tsx}" // para apps que consuman la lib
  ],
  safelist: [
    // backgrounds
    "bg-blue-100", "bg-yellow-100", "bg-red-100", "bg-green-100", "bg-purple-100",
    "dark:bg-blue-900", "dark:bg-yellow-900", "dark:bg-red-900", "dark:bg-green-900", "dark:bg-purple-900",

    // text
    "text-blue-800", "text-yellow-800", "text-red-800", "text-green-800", "text-purple-800",
    "dark:text-blue-200", "dark:text-yellow-200", "dark:text-red-200", "dark:text-green-200", "dark:text-purple-200",

    // borders
    "border-blue-500/30", "border-yellow-500/30", "border-red-500/30", "border-green-500/30", "border-purple-500/30",

    // soft bg
    "bg-blue-500/10", "bg-yellow-500/10", "bg-red-500/10", "bg-green-500/10", "bg-purple-500/10",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
