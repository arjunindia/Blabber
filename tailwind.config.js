/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    fontFamily: {
      sans: ["Noto Sans", "sans-serif"],
    },
    extend: {
      colors: {
        text: "#fee6e6",
        link: "#7494ff",
        background: "#050000",
        primary: "#633303",
        primaryDark: "#4e2700",
        secondary: "#261212",
        accent: "#f4f406",
      },
    },
  },
  // custom colors
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-full-bleed"),
    require("tailwind-content-placeholder"),
  ],
};
