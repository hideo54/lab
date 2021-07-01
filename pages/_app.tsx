import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        -webkit-text-size-adjust: 100%;
    }

    body, select, button {
        font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif;
        margin: 0;
    }

    header, main, footer {
        display: block; /* for IE */
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1em;
    }

    footer {
        margin-top: 3em;
        margin-bottom: 1em;
        padding: 0 1em;
    }

    h1, h2, h3, h4, h5, h6, p, div {
        color: #333333;
    }

    span {
        color: #333333;
        line-height: 100%;
    }

    a {
        color: #0091ea;
        text-decoration: none;
    }
`;

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Component {...pageProps} />
            <GlobalStyle />
        </>
    );
};

export default App;
