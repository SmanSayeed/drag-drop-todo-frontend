// filepath: d:\laragon\www\todo\todo-frontend\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // You can customize your color palette here
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        },
        boxShadow: {
          'task': '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        transitionProperty: {
          'height': 'height',
          'spacing': 'margin, padding',
        }
      },
    },
    plugins: [],
  }