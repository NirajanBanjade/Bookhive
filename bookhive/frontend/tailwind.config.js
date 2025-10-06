/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f97316",
          hover: "#ea580c",
        },
        accent: {
          DEFAULT: "#14b8a6",
          hover: "#0d9488",
        },
      },
    },
  },
  plugins: [],
};
