/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.html",
    "./src/**/*.tsx",
    "./lib/**/*.tsx",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        "system-ui": [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
        ],
        openSans: ['Open Sans Variable', 'sans-serif']
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}

