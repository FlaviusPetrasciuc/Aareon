import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aareon: {
          blue: "#051163",
          bright: "#086DFB",
          sand: "#F7F3F0",
          stone: "#EBE3DC",
          coral: "#FF7F62",
          headline: "#081326",
          body: "#384152",
        },
      },
      fontFamily: {
        title: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
