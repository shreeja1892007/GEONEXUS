/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#173B57',
          dark: '#112B40',
          light: '#235074',
          subtle: '#F0F4F8',
        },
        primaryBlue: {
          DEFAULT: '#246BCE',
          hover: '#1D5BB2',
          light: '#EBF2FC',
        },
        tealAccent: {
          DEFAULT: '#087F8C',
          hover: '#066772',
          light: '#E6F6F7',
        },
        govSuccess: {
          DEFAULT: '#2E7D32',
          light: '#EAF5EB',
        },
        govWarning: {
          DEFAULT: '#E99A24',
          light: '#FEF6E9',
        },
        govError: {
          DEFAULT: '#C53A3A',
          light: '#FBEBEB',
        },
        pageBg: '#F5F7F9',
        cardBg: '#FFFFFF',
        textPrimary: '#1D2733',
        textMuted: '#657281',
      },
      borderRadius: {
        'button': '11px',
        'card': '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(23, 59, 87, 0.06), 0 2px 6px -1px rgba(23, 59, 87, 0.04)',
        'card-hover': '0 10px 30px -4px rgba(23, 59, 87, 0.1), 0 4px 12px -2px rgba(23, 59, 87, 0.06)',
        'button': '0 2px 4px rgba(36, 107, 206, 0.2)',
      }
    },
  },
  plugins: [],
}

