import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D5C3D',
          light: '#1A8A5C',
          dark: '#094A32',
        },
        secondary: {
          DEFAULT: '#C9A227',
          light: '#E5B82A',
        },
        accent: '#1E3A5F',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
