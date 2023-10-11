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
        },
        fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', 'Hiragino Sans', 'var(--font-noto)', 'sans-serif'],
            noto: ['var(--font-noto)', 'sans-serif'],
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('daisyui'),
    ],
};
