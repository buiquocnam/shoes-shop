import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: "#FF4D2D",
          hover: "#E63E1F",
          active: "#E63E1F",
        },
        // Secondary Colors
        black: {
          DEFAULT: "#111111",
        },
        "dark-gray": {
          DEFAULT: "#333333",
        },
        "light-gray": {
          DEFAULT: "#F5F5F5",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        // Background & Surface Colors
        "background-light": "#F5F5F5",
        "background-dark": "#221610",
        "surface-light": "#FFFFFF",
        "surface-dark": "#2d201a",
        // Status Colors
        success: {
          DEFAULT: "#22C55E",
        },
        warning: {
          DEFAULT: "#F59E0B",
        },
        error: {
          DEFAULT: "#EF4444",
        },
        "sale-red": "#EF4444",
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(255, 77, 45, 0.3)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        display: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
