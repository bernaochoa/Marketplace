/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e9fbff",
          100: "#d0f7ff",
          200: "#a0efff",
          300: "#6de7ff",
          400: "#3adfff",
          500: "#10b5e8",
          600: "#0b9bc7",
          700: "#087a9e",
          800: "#065a75",
          900: "#043a4c",
        },
        dark: {
          blue: "#0b2234",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 35px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
}
