import transformerVariantGroup from "@unocss/transformer-variant-group";
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind,
  type UserConfig,
} from "unocss";

export default defineConfig({
  cli: {
    entry: {
      patterns: ["src/**/*.{ts,tsx}"],
      outFile: "public/dist/unocss.css",
    },
  },
  theme: {
    colors: {
      text: "#fee6e6",
      link: "#7494ff",
      background: "#050000",
      primary: "#633303",
      primaryDark: "#4e2700",
      primaryWhite: "#f4f4f4",
      primaryWhiteText: "#242424",
      secondary: "#261212",
      accent: "#f4f406",
    },
  },
  rules: [
    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${Number(num) * 0.25}rem` })],
    [
      "bg-login",
      {
        "background-image": `url("/public/login-bg.jpg")`,
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
        "background-attachment": "fixed",
        "background-blend-mode": "soft-light",
      },
    ],
    [
      "bg-signup",
      {
        "background-image": 'url("/public/signup-bg.jpg")',
        "background-size": "cover",
        "background-position": "center",
        "background-repeat": "no-repeat",
        "background-attachment": "fixed",
        "background-blend-mode": "soft-light",
      },
    ],
  ],
  presets: [
    presetWind(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetWebFonts(),
    presetTypography(),
  ],
  transformers: [transformerVariantGroup()],
});
