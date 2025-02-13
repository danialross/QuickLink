import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#2E8B57",
                secondary: "#F5F5DC",
                accent: "#2F4F4F"
            },
            fontFamily: {
                kanit: ["Kanit", "sans-serif"]
            }
        }
    },
    plugins: []
} satisfies Config;
