import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F4701F',
          deep: '#E85D04',
          soft: '#FFF3E8',
          peach: '#FCE7CE',
        },
        ink: '#22252B',
        muted: '#8C919B',
        line: '#EEF0F3',
        pro: '#2FB07C',
        carb: '#F0A93B',
        fat: '#EB6F6F',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 22px rgba(31,34,40,.06)',
        nav: '0 -2px 24px rgba(31,34,40,.07)',
        float: '0 14px 40px rgba(232,93,4,.28)',
      },
    },
  },
  plugins: [],
};
export default config;
