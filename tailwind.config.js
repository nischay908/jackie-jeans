/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        ink:    '#0D0E14',
        denim:  '#1A2744',
        indigo: '#2B3F72',
        steel:  '#4A6FA5',
        gold:   '#C9A84C',
        cream:  '#F2EDE4',
        mist:   '#8A95A8',
      },
      animation: {
        'pulse-gold': 'pulseGold 1.4s ease-in-out infinite',
        'fade-up':    'fadeUp 0.45s cubic-bezier(0.23,1,0.32,1) forwards',
        'record':     'recordPulse 1s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%':     { boxShadow: '0 0 0 20px rgba(201,168,76,0)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        recordPulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(224,92,92,0.4)' },
          '50%':     { boxShadow: '0 0 0 16px rgba(224,92,92,0)' },
        },
      },
    },
  },
  plugins: [],
}
