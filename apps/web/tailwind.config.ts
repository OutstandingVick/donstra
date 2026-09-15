import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  important: "#donstra-app",
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        donstra: { black: "#0D160B", green: "#16DB65", red: "#5C1A1B" },
      },
    },
  },
  plugins: [],
};

export default config;
