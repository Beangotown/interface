const plugin = require("tailwindcss/plugin");
const flattenColorPalette =
  require("tailwindcss/lib/util/flattenColorPalette").default;
const { parseColor } = require("tailwindcss/lib/util/color");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        paytone: ["Paytone One", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "text-stroke": (value) => {
            const { color } = parseColor(value);
            const colorString = `rgb(${color[0]} ${color[1]} ${color[2]})`;

            return {
              "-webkit-text-stroke": `1px ${colorString}`,
            };
          },
        },
        { values: flattenColorPalette(theme("colors")), type: "color" }
      );
    }),
  ],
};
