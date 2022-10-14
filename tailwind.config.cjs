/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        track: "32px 6fr 4fr 3fr minmax(120px,1fr)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
