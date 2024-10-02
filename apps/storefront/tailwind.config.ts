// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/store'
const config: Pick<Config, "content" | "presets" | "theme" > = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
  theme:{
    container:{
      padding:{
        DEFAULT: "15px",
      }
    },
    screens:{
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1330px"
    },
    extend:{
      colors:{
        primary: "#242a2b",
        secondary: "#808080",
        accent: {
          DEFAULT: "#0071bc",
          secondary: "#0ba6fe",
          tertiary: "#90c6cd",
        },
        grey: "#e8f0f1",     
       },
      fontFamily:{
        primary: "Poppins"
      },
      boxShadow: {
        custom1: "0px 2px 40px 0px rgba(8, 70, 78, 0.08)",
        custom2: "0px 0px 30px 0px rgba(8, 73, 81, 0.06)",
      },
      backgroundImage:{
        services:`url(${basePath}/img/services/bg.svg)`,
        testimonials:`url(${basePath}/img/testimonials/bg.svg)`,
        departments:`url(${basePath}/img/departments/bg.svg)`,
        quoteLeft:`url(${basePath}/icons/testimonials/quote-left.svg)`,
        quoteRight:`url(${basePath}/icons/testimonials/quote-right.svg)`,
        banner:`url(${basePath}/img/banner/bg.png)`,
      }
    }
  }
};

export default config;
