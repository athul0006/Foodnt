/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#eff6ff',
          border: '#bfdbfe',
        },
        coral: {
          DEFAULT: '#ef4444',
          light: '#fef2f2',
          border: '#fecaca',
          dark: '#b91c1c',
        },
        amber: {
          DEFAULT: '#d97706',
          light: '#fffbeb',
          border: '#fde68a',
        },
        emerald: {
          DEFAULT: '#059669',
          light: '#ecfdf5',
          border: '#a7f3d0',
        },
        navy: {
          DEFAULT: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
