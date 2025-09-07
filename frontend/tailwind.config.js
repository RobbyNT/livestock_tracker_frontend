const { platformBrowser } = require("@angular/platform-browser");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#84714F",
        "primary-light": "#F3E8D9",
        "primary-dark": "#7C4D00",
        secondary: "#E2F1AF",
        "secondary-light": "#F3F4F6",
        "secondary-dark": "#D1D5DB",
        accent: "#31231E",
        "accent-light": "#F9FAFB",
        "accent-dark": "#1F2937",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
