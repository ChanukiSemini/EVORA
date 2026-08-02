/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // IMPORTANT: preflight (Tailwind's base CSS reset) is turned off on
  // purpose. The original project already ships its own global reset
  // and design system in src/index.css. Leaving preflight on would
  // re-reset headings, buttons, forms, spacing, etc. site-wide and
  // alter the existing look. With it off, Tailwind only ever *adds*
  // utility classes - it never removes or resets anything the
  // original CSS already set up.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        evora: {
          bg: '#031C26',
          panel: '#052a37',
          card: '#063242',
          border: '#0e4356',
          green: '#3DDC97',
          greenDark: '#2bb87c',
          text: '#eafff5',
          muted: '#8fb6c2',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(61, 220, 151, 0.18)',
        'glow-sm': '0 0 20px rgba(61, 220, 151, 0.28)',
      },
    },
  },
  plugins: [],
}
