/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.html",
    "./src/**/*.tsx",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {

    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}

