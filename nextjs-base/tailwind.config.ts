import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        hurricane: ['var(--font-hurricane)', 'cursive'],
      },
      colors: {
        wedding: {
          gold: '#74511e',
          peach: '#F9E1D1',
          'green-light': '#D9EDCB',
          'green-selected': '#D4E8C5',
        },
      },
    },
  },
  plugins: [],
}

export default config
