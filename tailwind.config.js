import nativewindPreset from "nativewind/preset";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Includes /app and its subdirectories like /tabs, /_layouts, etc.
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [nativewindPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};
