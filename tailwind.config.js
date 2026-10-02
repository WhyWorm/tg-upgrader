/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#000000',
          card: '#1c1c1e',
          cardSecondary: '#2c2c2e',
          cardTertiary: '#3a3a3c',
          border: 'rgba(255, 255, 255, 0.08)',
          blue: '#007AFF',
          blueLight: '#0A84FF',
          gray: '#8e8e93',
          green: '#34C759',
          red: '#FF3B30',
          amber: '#FF9500',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Roboto', 'sans-serif'],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
