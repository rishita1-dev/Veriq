/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050b16",
          900: "#0a1220",
          850: "#0d1729",
          800: "#111f33",
          700: "#16283f",
          600: "#1d3450",
        },
        brand: {
          cyan: "#38d6ff",
          blue: "#4fb6ff",
          green: "#34d399",
          amber: "#f5a623",
          red: "#f2495c",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,214,255,0.15), 0 20px 60px -20px rgba(56,214,255,0.25)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 20%, rgba(56,214,255,0.10), transparent 40%), radial-gradient(circle at 80% 0%, rgba(52,211,153,0.08), transparent 35%)",
      },
    },
  },
  plugins: [],
};
