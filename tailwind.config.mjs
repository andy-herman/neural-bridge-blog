import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Charter', 'Georgia', 'serif'],
        sans: ['"Albert Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        cream: {
          50: '#faf8f4',
          100: '#f5f1e8',
          200: '#ebe5d4',
          300: '#d6cdb6',
          800: '#3d3528',
          900: '#1f1a14',
          950: '#171210',
        },
        rust: {
          400: '#ea6630',
          500: '#c2410c',
          600: '#9a330a',
          700: '#7b2912',
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.cream.900'),
            '--tw-prose-headings': theme('colors.cream.950'),
            '--tw-prose-lead': theme('colors.cream.800'),
            '--tw-prose-links': theme('colors.rust.500'),
            '--tw-prose-bold': theme('colors.cream.950'),
            '--tw-prose-quotes': theme('colors.cream.800'),
            '--tw-prose-quote-borders': theme('colors.rust.500'),
            '--tw-prose-code': theme('colors.cream.950'),
            '--tw-prose-pre-code': theme('colors.cream.100'),
            '--tw-prose-pre-bg': theme('colors.cream.950'),
            '--tw-prose-th-borders': theme('colors.cream.300'),
            '--tw-prose-td-borders': theme('colors.cream.200'),
            '--tw-prose-invert-body': theme('colors.cream.100'),
            '--tw-prose-invert-headings': theme('colors.cream.50'),
            '--tw-prose-invert-lead': theme('colors.cream.200'),
            '--tw-prose-invert-links': theme('colors.rust.400'),
            '--tw-prose-invert-bold': theme('colors.cream.50'),
            '--tw-prose-invert-quotes': theme('colors.cream.200'),
            '--tw-prose-invert-quote-borders': theme('colors.rust.400'),
            '--tw-prose-invert-code': theme('colors.cream.50'),
            fontFamily: '"Albert Sans", system-ui, sans-serif',
            fontSize: '1.0625rem',
            lineHeight: '1.7',
            'h1, h2, h3, h4': {
              fontFamily: 'Fraunces, Charter, Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h1: { fontSize: '2.5rem', lineHeight: '1.1', marginTop: '0' },
            h2: {
              fontSize: '1.75rem',
              lineHeight: '1.2',
              marginTop: '2.5em',
              marginBottom: '0.75em',
            },
            h3: { fontSize: '1.375rem', marginTop: '2em' },
            code: {
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontWeight: '500',
              fontSize: '0.9em',
              backgroundColor: theme('colors.cream.200'),
              padding: '0.15em 0.35em',
              borderRadius: '3px',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            blockquote: {
              fontFamily: 'Fraunces, Charter, Georgia, serif',
              fontStyle: 'italic',
              fontWeight: '400',
              fontSize: '1.125em',
              borderLeftWidth: '3px',
            },
            'blockquote p:first-of-type::before': { content: '""' },
            'blockquote p:last-of-type::after': { content: '""' },
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              fontWeight: '500',
            },
          },
        },
        invert: {
          css: {
            code: {
              backgroundColor: theme('colors.cream.900'),
              color: theme('colors.cream.50'),
            },
            'th, td': {
              borderColor: theme('colors.cream.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
