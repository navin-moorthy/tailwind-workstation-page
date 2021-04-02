const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const tailwindForms = require('@tailwindcss/forms');
const tailwindAspectRatio = require('@tailwindcss/aspect-ratio');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'light-blue': colors.lightBlue,
        cyan: colors.cyan,
        teal: colors.teal,
      },
    },
  },
  plugins: [tailwindForms, tailwindAspectRatio],
};
