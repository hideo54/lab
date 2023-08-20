/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',

        // Or if using `src` directory:
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        a: {
                            color: '#0091ea',
                            textDecoration: 'none',
                        },
                    },
                },
            },
        },
        fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', 'Hiragino Sans', 'Noto Sans JP', 'sans-serif'],
            noto: ['Noto Sans JP', 'sans-serif'],
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
