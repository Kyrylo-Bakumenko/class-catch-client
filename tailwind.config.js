const { lightBlue, yellow } = require('@mui/material/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Green Palette
        brandGreen: {
          light: "#e0f2e9",
          DEFAULT: "#38a169",
          dark: "#2f855a",
        },
        grayText: "#333",
        orange: "#f6993f",
        yellow: "#f9d88c",
      },
      keyframes: {
        floatRightToLeft: {
          '0%':   { transform: 'translateX(8000%) translateY(-150%)' },
          '25%':  { transform: 'translateX(5000%) translateY(-10%)' },
          '50%':  { transform: 'translateX(3000%) translateY(150%)' },
          '75%':  { transform: 'translateX(1000%) translateY(10%)' },
          '100%': { transform: 'translateX(-1000%) translateY(-150%)' },
        },
        floatLeftToRight: {
          '0%':   { transform: 'translateX(-150%) translateY(0%)' },
          // '25%':  { transform: 'translateX(-75%) translateY(5%)' },
          '50%':  { transform: 'translateX(3000%) translateY(10%)' },
          // '75%':  { transform: 'translateX(50%) translateY(5%)' },
          '100%': { transform: 'translateX(8000%) translateY(0%)' },
        },
      },
      animation: {
        floatR2L: 'floatRightToLeft 15s linear infinite',
        floatL2R: 'floatLeftToRight 15s linear infinite',
      },
    },
  },
  plugins: [],
};
