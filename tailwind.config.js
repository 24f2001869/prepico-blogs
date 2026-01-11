/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prepico Brand Colors (from their website)
        'prepico': {
          'blue': '#2563EB',      // Primary blue
          'indigo': '#4F46E5',    // Secondary indigo
          'light-blue': '#E0F2FE', // Light background
          'dark': '#1F2937',      // Dark text
          'gray': '#6B7280',      // Gray text
          'light-gray': '#F9FAFB' // Light background
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'prepico': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'prepico-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'prepico': '12px',
        'prepico-lg': '20px',
      },
      backgroundImage: {
        'prepico-gradient': 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
        'prepico-gradient-light': 'linear-gradient(135deg, #E0F2FE 0%, #F3E8FF 100%)',
      }
    },
  },
  plugins: [],
}
