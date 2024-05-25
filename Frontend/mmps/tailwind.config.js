/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxl': '1440px',  // Custom breakpoint for 1440px
      },
    },
  },
  plugins: [],
}