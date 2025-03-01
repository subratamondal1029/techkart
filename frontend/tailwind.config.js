/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s linear infinite',
        'ping-slow': 'ping 2s linear infinite',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #abbaab, #ffffff);',
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        'input[type=number]': {
          '-moz-appearance': 'textfield',
        },
      });
    },
  ],
}

