module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'responsive-base': ['16px', '24px'],
        'responsive-lg': ['18px', '28px'],
        'responsive-xl': ['20px', '30px'],
        'responsive-2xl': ['24px', '36px'],
        'responsive-3xl': ['30px', '45px'],
      },
      aspectRatio: {
        'w-16': '16',
        'h-9': '9',
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-delay': 'fade-in 1s ease-out 0.5s forwards',
        'fade-in-delay-2': 'fade-in 1s ease-out 1s forwards',
      },
      keyframes: {
        'slow-zoom': {
          '0%, 100%': { transform: 'scale(1.0)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
