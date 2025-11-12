/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-surface-light': '#334155',
        'accent-primary': '#3b82f6',
        'accent-primary-hover': '#2563eb',
        'accent-secondary': '#06b6d4',
        'accent-success': '#10b981',
        'accent-danger': '#ef4444',
        'accent-warning': '#f59e0b',
      },
      fontSize: {
        'display': '3.5rem',
        'heading1': '2.25rem',
        'heading2': '1.875rem',
        'heading3': '1.5rem',
        'body': '1rem',
        'small': '0.875rem',
      },
      spacing: {
        'gutter': '1.5rem',
        'section': '3rem',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 25px rgba(0, 0, 0, 0.4)',
        'input': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
