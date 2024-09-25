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
        'sulphur-yellow': 'var(--sulphur-yellow)',
        'sap-green': 'var(--sap-green)',
        'font-primary': 'var(--font-primary)',
        'font-secondary': 'var(--font-secondary)',
      },
    },
  },
  plugins: [],
};
export default config;
