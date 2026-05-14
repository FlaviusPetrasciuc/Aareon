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
        title: ["Canela", "Georgia", "serif"],
        body: ["Basis Grotesque", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
