import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: "https://tools.filtero.in",
      dynamicRoutes: [
        "/attendance-calculator",
        "/cgpa-calculator",
        "/percentage-calculator",
        "/internal-marks-calculator",
        "/board-predictor",
        "/emi-calculator",
        "/salary-calculator",
        "/loan-calculator",
        "/word-counter",
        "/study-timer",
        "/pomodoro-timer",
        "/unit-converter",
        "/age-calculator"
      ]
    })
  ]
});