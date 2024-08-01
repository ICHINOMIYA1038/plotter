import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        "95vh": "95vh",
        "90vh": "90vh",
        "85vh": "85vh",
        "80vh": "80vh",
        "50vh": "50vh",
        "45vh": "45vh",
        "40vh": "40vh",
        "20vh": "20vh",
      },
    },
  },
  plugins: [],
};
export default config;
