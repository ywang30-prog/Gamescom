/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logitech: ['Brown_Logitech_Pan', 'sans-serif'],
      },
      colors: {
        primary: {
          default: '#00b6fa',
        },
        surface: {
          neutral: {
            default: '#242424',
            black: '#fbfbfb',
            solid: {
              default: '#f0f0f0',
            },
          },
        },
        background: {
          950: '#1a1a1a',
        },
        text: {
          primary: {
            default: '#00b6fa',
          },
          neutral: {
            default: '#e6e6e6',
            muted: '#a7a7a8',
            white: '#fbfbfb',
          },
        },
        stroke: {
          primary: {
            default: '#00b6fa',
          },
          neutral: {
            default: '#666',
            disabled: '#333',
          },
        },
        status: {
          success: {
            default: '#2dba3e',
            highlight: '#082b0d',
          },
        },
      },
      spacing: {
        '04': '4px',
        '08': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
      },
      borderRadius: {
        '02': '2px',
        '04': '4px',
        '08': '8px',
        '16': '16px',
        '40': '40px',
      },
    },
  },
  plugins: [],
}
