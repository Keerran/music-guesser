/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                main: {
                    DEFAULT: "#030303",
                },
                accent: {
                    light: "#a52e5a",
                    dark: "#811219"
                }
            }
        },
    },
    plugins: [],
}

