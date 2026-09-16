import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        donstra: { black: "#0D160B", green: "#16DB65", red: "#5C1A1B" },
      },
      keyframes: {
        "hero-drift": {
          "0%, 100%": { transform: "translate3d(-3%, 0, 0)" },
          "50%": { transform: "translate3d(3%, -10px, 0)" },
        },
        "agent-float": {
          "0%, 100%": { transform: "translateY(0) rotate(var(--agent-rotate))" },
          "50%": { transform: "translateY(-18px) rotate(var(--agent-rotate))" },
        },
        "agent-glow": {
          "0%, 100%": { opacity: "0.65", filter: "brightness(0.9)" },
          "50%": { opacity: "1", filter: "brightness(1.25)" },
        },
      },
      animation: {
        "hero-drift": "hero-drift 16s ease-in-out infinite",
        "agent-float": "agent-float 7s ease-in-out infinite",
        "agent-glow": "agent-glow 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
