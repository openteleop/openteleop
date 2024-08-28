/** @type {import('tailwindcss').Config} */

import { radixThemePreset } from "radix-themes-tw";

export default {
  darkMode: ["class"],
  presets: [radixThemePreset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /^(bg-(?:tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|brown|orange|sky|mint|lime|yellow|amber|gold|bronze|gray|mauve|slate|sage|olive|sand|accent)-(?:1|2|3|4|5|6|7|8|9|10|11|12))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|brown|orange|sky|mint|lime|yellow|amber|gold|bronze|gray|mauve|slate|sage|olive|sand|accent)-(?:1|2|3|4|5|6|7|8|9|10|11|12))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|brown|orange|sky|mint|lime|yellow|amber|gold|bronze|gray|mauve|slate|sage|olive|sand|accent)-(?:1|2|3|4|5|6|7|8|9|10|11|12))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|brown|orange|sky|mint|lime|yellow|amber|gold|bronze|gray|mauve|slate|sage|olive|sand|accent)-(?:1|2|3|4|5|6|7|8|9|10|11|12))$/,
    },
    {
      pattern:
        /^(stroke-(?:tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|brown|orange|sky|mint|lime|yellow|amber|gold|bronze|gray|mauve|slate|sage|olive|sand|accent)-(?:1|2|3|4|5|6|7|8|9|10|11|12))$/,
    },
    {
      pattern:
        /^(fill-(?:tomato|red|ruby|crimson|pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade|green|grass|brown|orange|sky|mint|lime|yellow|amber|gold|bronze|gray|mauve|slate|sage|olive|sand|accent)-(?:1|2|3|4|5|6|7|8|9|10|11|12))$/,
    },
  ],
}

