export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          900: "#134e4a"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(20, 184, 166, 0.18)"
      }
    }
  },
  plugins: []
};
