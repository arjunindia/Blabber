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
    require("tailwind-content-placeholder")({
      bgColor: "#211",
      animated: true,
      placeholders: {
        paragraph: {
          height: 24, // the height of the container in em
          rows: [
            // This class will have 4 rows:
            [100], // A 100% width row
            [100], // Another 100% width row
            [100], // Another 100% width row
            [100], // Another 100% width row
            [100], // Another 100% width row
            [40], // A 40% width row
            [], // And an empty row, to create separation
          ],
        },
      },
    }),
  ],
};
