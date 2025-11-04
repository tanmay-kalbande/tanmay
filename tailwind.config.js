/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./{apps,components,contexts,hooks}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode (e.g., <html class="dark">)
  theme: {
    extend: {
      fontFamily: {
        // Sets 'Inter' as the default sans-serif font, matching your index.html
        sans: ['Inter', 'sans-serif'],
      },
      // You could extend colors, animations, etc. here if needed
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Adds the 'prose' classes for styling markdown
  ],
}
