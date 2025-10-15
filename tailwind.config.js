/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class', '[data-mantine-color-scheme="dark"]'], // keep Mantine support
    content: [
        "./index.html",                   // entry file
        "./src/**/*.{js,ts,jsx,tsx}",     // all your React components
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
