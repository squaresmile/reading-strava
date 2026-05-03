import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#000000",
        panel: "#1f1f1f",
        "panel-strong": "#242424",
        muted: "#9c9ca3",
        "muted-label": "#aaaab1",
        orange: "#ff711c",
        "orange-dim": "#5b2208",
        danger: "#dc2626",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "pause-ring": "inset 0 0 0 4px #292929",
        dialog: "0 1.5rem 5rem rgb(0 0 0 / 0.7)",
      },
    },
  },
  plugins: [],
} satisfies Config;
