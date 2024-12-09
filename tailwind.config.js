/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "lalezar": ['Lalezar'],
      },
      colors: {
        "primary": "var(--primary-color)",

        "text-primary": "var(--text-primary-color)",
        "background": "var(--background-color)",

        "button-hover": "var(--button-hover-color)",
        "button-hover-secondary": "var(--button-hover-color-secondary)",
        "primary-hover": "var(--primary-hover-color)",

        "background-neutral": "var(--neutral-color)",
        "text-neutral": "var(--text-neutral-color)",

        "disabled": "var(--disabled-color)",

        "success": "var(--success-color)",
        "warning": "var(--warning-color)",
        "error": "var(--error-color)",
      },
      width: {
        "sidebar-expanded": "var(--sidebar-width-expanded)",
        "sidebar-collapsed": "var(--sidebar-width-collapsed)",
      }
    },
  },
  plugins: [],
}