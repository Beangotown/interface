const plugin = require('tailwindcss/plugin');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;
const { parseColor } = require('tailwindcss/lib/util/color');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        paytone: ['Paytone One', 'sans-serif'],
        fonarto: ['Fonarto'],
      },
      colors: {
        'leaderboard-gold': '#DE7B3D',
        'leaderboard-silver': '#6976CD',
        'leaderboard-bronze': '#B5412C',
        'leaderboard-blue': '#0538C9',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'text-stroke': (value) => {
            const { color } = parseColor(value);
            const colorString = `rgb(${color[0]} ${color[1]} ${color[2]})`;

            return {
              '-webkit-text-stroke': `1px ${colorString}`,
            };
          },
          'diagonal-bg': (value) => {
            const { color } = parseColor(value);
            const colorString = `rgb(${color[0]} ${color[1]} ${color[2]})`;

            return {
              background: `linear-gradient(to right bottom, rgba(255, 255, 255, 0.1) 50%, ${colorString} 50.3%)`,
            };
          },
        },
        // { values: flattenColorPalette(theme('colors')), type: 'color' },
      );
    }),
  ],
};
