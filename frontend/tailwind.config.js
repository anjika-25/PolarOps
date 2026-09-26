/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polar: {
          bg: '#F5F7F9',
          card: '#FFFFFF',
          sidebar: '#0B1F33',
          sidebarHover: '#163A59',
          primary: '#2F6F95',
          primaryHover: '#245978',
          text: '#17212B',
          textMuted: '#667482',
          border: '#D9E0E6',
          statusOk: '#287D4C',
          statusWarning: '#D89B24',
          statusCritical: '#C74646',
        }
      }
    },
  },
  plugins: [],
}
