import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#EAF6FC",
          100: "#D2EDF8",
          200: "#A7DBF2",
          300: "#7CC8EA",
          400: "#46AEDD",
          500: "#1C8FCC", // primary
          600: "#15709F",
          700: "#105676",
          800: "#0B3D54",
          900: "#072A3B",
        },
        ink: {
          DEFAULT: "#14181F", // secondary black, softened
          subtle: "#4A5160",
        },
        paper: {
          DEFAULT: "#FFFFFF", // secondary white
          muted: "#F6F8FA",
          tag: "#FBFCFD",
        },
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        tag: "4px",
      },
      backgroundImage: {
        "stitch-h":
          "repeating-linear-gradient(to right, currentColor 0, currentColor 6px, transparent 6px, transparent 12px)",
        "stitch-v":
          "repeating-linear-gradient(to bottom, currentColor 0, currentColor 6px, transparent 6px, transparent 12px)",
      },
    },
  },
  plugins: [],
}
export default config
