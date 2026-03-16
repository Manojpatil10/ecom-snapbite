// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }



/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease both',
        'slide-in-right': 'slideInRight 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.3s ease both',
        float: 'float 3.5s ease-in-out infinite',
        blob: 'blob 8s ease-in-out infinite',
        'bounce-once': 'bounceOnce 0.7s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 55% 45% / 50% 55% 45% 50%' },
          '50%': { borderRadius: '40% 60% 45% 55% / 55% 45% 50% 50%' },
        },
        bounceOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.25)' },
          '60%': { transform: 'scale(0.92)' },
        },
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 3px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
