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
            mono: ['var(--font-mono)', 'monospace'],
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...require('daisyui/src/theming/themes')['light'],
                    primary: '#0091ea',
                },
                dark: {
                    ...require('daisyui/src/theming/themes')['dark'],
                    'base-100': '#000000',
                    'base-content': '#ffffff',
                    primary: '#0091ea',
                },
            },
        ],
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('daisyui'),
    ],
};
