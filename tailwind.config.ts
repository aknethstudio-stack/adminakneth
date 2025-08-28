import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: 'var(--color-dark)',
        light: 'var(--color-light)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        'body-background': 'var(--color-body-background)',
        link: 'var(--color-link)',
        'link-hover': 'var(--color-link-hover)',
        'nav-active-bg': 'var(--color-nav-active-bg)',
        'body-text': 'var(--color-body-text)',
      },
      borderRadius: {
        'nav-pills': 'var(--border-radius-nav-pills)',
      },
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
