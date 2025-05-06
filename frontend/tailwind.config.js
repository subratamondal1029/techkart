/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 2s linear infinite",
        "ping-slow": "ping 2s linear infinite",
        "card-in": "cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        checkmark: "checkmark 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        "text-rise": "textRise 0.6s ease-out forwards",
        "button-in": "buttonIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
        float: "float 6s infinite",
      },
      keyframes: {
        cardIn: {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        checkmark: {
          "0%": {
            opacity: 0,
            transform: "scale(0) translateY(20px)",
          },
          "80%": {
            opacity: 1,
            transform: "scale(1.2) translateY(-5px)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(1) translateY(0)",
          },
        },
        textRise: {
          "0%": { opacity: 0, transform: "translateY(15px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        buttonIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)", opacity: 0.8 },
          "50%": { transform: "translateY(-100px)", opacity: 0 },
        },
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #abbaab, #ffffff)",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
          "-webkit-appearance": "none",
          margin: "0",
        },
        "input[type=number]": {
          "-moz-appearance": "textfield",
        },
        "input[list]::-webkit-calendar-picker-indicator ": {
          display: "none !important",
        },
      });
    },
  ],
};
