/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",      // This will include your main HTML file
      "./**/*.js",         // This will include all your JavaScript files
      "./**/*.html",       // This will include any other HTML files you might have in subdirectories
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('daisyui'),   // Including DaisyUI as a plugin
    ],
  }
  