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
                        maxWidth: '800px',
                        a: {
                            color: '#0091ea',
                            textDecoration: 'none',
                        },
                    },
                },
            },
            width: {
                '1/7': '14.2857143%',
                '1/14': '7.1428571%',
            },
            height: {
                '7/12': '58.3333333%',
            },
        },
        fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', 'Hiragino Sans', 'var(--font-noto)', 'sans-serif'],
            noto: ['var(--font-noto)', 'sans-serif'],
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
