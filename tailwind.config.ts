import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        fade: 'greenFade 3s ease-in-out',
      },
      keyframes: {
        greenFade: {
          '0%': { backgroundColor: 'green' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/forms')],
} satisfies Config
