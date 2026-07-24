import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        fg: {
          primary: "var(--color-fg-primary)",
          muted: "var(--color-fg-muted)",
        },
        surface: "var(--color-bg-surface)",
        accent: "var(--color-accent)", /* emerald */
      },
      fontSize: {
        'meta-sm': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.25em' }], // 10px
        'meta': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.2em' }], // 11px
        'body-sm': ['0.875rem', { lineHeight: '1.6' }], // 14px
        'body': ['1rem', { lineHeight: '1.6' }], // 16px
        'heading-sm': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }], // 20px
        'heading-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }], // 24px
        'heading-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }], // 36px
        'display': ['clamp(4rem, 10vw, 8rem)', { lineHeight: '1', letterSpacing: '-0.04em' }], // 64-128px
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
