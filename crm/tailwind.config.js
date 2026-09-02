/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        paper: '#F7F7F4',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C1D21',
          soft: '#5B5D66',
          faint: '#8B8D96',
        },
        border: {
          DEFAULT: '#E4E4E0',
          soft: '#EDEDE9',
        },
        primary: {
          50: '#EAF4F1',
          100: '#CFE6DD',
          400: '#3E8A76',
          500: '#2F6F5E',
          600: '#255A4C',
          700: '#1D4740',
        },
        accent: {
          50: '#EEF0FC',
          400: '#6272DE',
          500: '#4C5FD5',
          600: '#3C4CB0',
        },
        hot: { DEFAULT: '#DC4B3E', bg: '#FCEAE8' },
        warm: { DEFAULT: '#B9740A', bg: '#FCF1DE' },
        cold: { DEFAULT: '#3B7DDB', bg: '#EAF1FC' },
        danger: { DEFAULT: '#C0392B', bg: '#FBEAE8' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 29, 33, 0.04), 0 1px 8px rgba(28, 29, 33, 0.04)',
        pop: '0 8px 30px rgba(28, 29, 33, 0.12)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}
