import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { Noto_Sans_JP } from 'next/font/google';
import * as gtag from '../lib/gtag';
import './globals.css';

const notoSans = Noto_Sans_JP({
    subsets: ['latin'],
    variable: '--font-noto',
    weight: ['300', '400', '700', '800'],
});

const mono = Noto_Sans_JP({
    subsets: ['latin'],
    variable: '--font-mono',
    weight: ['300', '400', '700', '800'],
});

const App = ({ Component, pageProps }: AppProps) => {
    const router = useRouter();
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
    // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics/pages/_app.js
    return (
        <>
            <div className={`${notoSans.variable} ${mono.variable} font-sans`}>
                <Component
                    {...pageProps}
                />
            </div>
        </>
    );
};

export default App;
