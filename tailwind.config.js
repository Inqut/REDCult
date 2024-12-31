/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          darkest: '#1E0707', // Slightly lighter dark background
          darker: '#2D0808',  // Warmer dark shade
          dark: '#4A0808',    // Richer dark red
          DEFAULT: '#DC2626', // Brighter primary red
          light: '#EF4444',   // Vibrant light red
          bright: '#FCA5A5',  // New bright accent
        },
        accent: {
          purple: '#9333EA',  // Royal purple accent
          gold: '#F59E0B',    // Warm gold accent
          blue: '#3B82F6',    // Electric blue accent
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(220, 38, 38, 0.3)',
        'glow-lg': '0 0 25px rgba(220, 38, 38, 0.4)',
      }
    },
  },
  plugins: [],
};