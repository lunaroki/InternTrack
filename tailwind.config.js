/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        canvas: '#F4F7FB',
        surface: '#FFFFFF',
        line: { DEFAULT: '#E3E9F2', strong: '#CBD5E3' },
        ink: { DEFAULT: '#0F1B2D', muted: '#44546A', subtle: '#5F6E84' },
        brand: {
          50: '#EEF5FF',
          100: '#DCEBFF',
          200: '#B9D6FF',
          300: '#8BBBFA',
          400: '#5A9BF0',
          500: '#3B82E6',
          600: '#2566C9',
          700: '#1F54A6',
          800: '#1C4685',
          900: '#183A6B',
        },
        danger: { DEFAULT: '#C8364A', strong: '#A62B3D', soft: '#FDECEE' },
        status: {
          saved: { bg: '#EEF2F7', fg: '#3F4D63', dot: '#94A3B8' },
          applied: { bg: '#E6F0FF', fg: '#1F54A6', dot: '#3B82E6' },
          interviewing: { bg: '#FFF3DC', fg: '#7A4A00', dot: '#E9A23B' },
          offered: { bg: '#E3F5EC', fg: '#17643F', dot: '#2FA36B' },
          rejected: { bg: '#FDECEE', fg: '#9E2536', dot: '#E05468' },
        },
        event: {
          deadline: { bg: '#FDECEE', fg: '#9E2536', dot: '#E05468' },
          interview: { bg: '#EEEBFF', fg: '#47379F', dot: '#7B68E8' },
          followup: { bg: '#E2F4F2', fg: '#155E57', dot: '#2AA198' },
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 27, 45, 0.04), 0 1px 3px rgba(15, 27, 45, 0.05)',
        pop: '0 16px 40px -12px rgba(15, 27, 45, 0.25), 0 2px 6px rgba(15, 27, 45, 0.06)',
      },
    },
  },
  plugins: [],
};
