/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // MOOSING brand tokens
        moo: {
          bg: "#0A0A0F",
          bg2: "#12121C",
          violet: "#7C3AED",
          blue: "#2563EB",
          cyan: "#06B6D4",
          magenta: "#EC4899",
          orange: "#F97316",
          emerald: "#10B981",
          emerald2: "#34D399",
          amber: "#F59E0B",
          rose: "#F43F5E",
          ink: "#F8FAFC",
          muted: "#94A3B8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        arabic: ["Cairo", "Tajawal", "sans-serif"],
      },
      backgroundImage: {
        "moo-primary":
          "linear-gradient(120deg, #7C3AED 0%, #2563EB 50%, #06B6D4 100%)",
        "moo-secondary": "linear-gradient(120deg, #EC4899 0%, #F97316 100%)",
        "moo-success": "linear-gradient(120deg, #10B981 0%, #34D399 100%)",
        "moo-aurora":
          "radial-gradient(at 20% 20%, rgba(124,58,237,0.35) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(6,182,212,0.30) 0px, transparent 50%), radial-gradient(at 70% 80%, rgba(236,72,153,0.25) 0px, transparent 50%), radial-gradient(at 10% 90%, rgba(37,99,235,0.30) 0px, transparent 50%)",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "aurora-move": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(4%,-6%) scale(1.1)" },
          "66%": { transform: "translate(-4%,4%) scale(0.95)" },
        },
        "border-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "gradient-fast": "gradient-shift 4s ease infinite",
        "aurora-move": "aurora-move 18s ease-in-out infinite",
        "border-pulse": "border-pulse 3s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin-slow 24s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
