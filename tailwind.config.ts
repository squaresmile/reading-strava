import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--color-page)",
        panel: "var(--color-panel)",
        "panel-strong": "var(--color-panel-strong)",
        muted: "var(--color-muted)",
        "muted-label": "var(--color-muted-label)",
        fg: "var(--color-fg)",
        orange: "#ff711c",
        "orange-dim": "var(--color-orange-dim)",
        danger: "#dc2626",
      },
      fontFamily: {
        display: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        "pause-ring": "inset 0 0 0 4px #292929",
        dialog: "0 1.5rem 5rem rgb(0 0 0 / 0.7)",
      },
    },
  },
  plugins: [],
} satisfies Config;
