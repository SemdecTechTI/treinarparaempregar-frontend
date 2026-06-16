import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#284f94',
          light: '#4e75ba',
          dark: '#3b5399',
        },
        accent: '#009aab',
        text: '#3b3d42',
        muted: '#a1a2a4',
        h3: '#45a3b5',
        h4: '#e8bc40',
        h5: '#c85c5d',
        h6: '#bf3364',
        surface: '#f4f7fb',
        prefeitura: '#00519a',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(40, 79, 148, 0.12)',
        glow: '0 8px 32px -8px rgba(0, 154, 171, 0.35)',
        card: '0 2px 8px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(40, 79, 148, 0.1)',
        'card-hover': '0 20px 48px -12px rgba(40, 79, 148, 0.22)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-16px) scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
