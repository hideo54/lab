import { ReactNode } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { ChevronBack } from '@styled-icons/ionicons-outline';
import { IconNextLink } from '@hideo54/reactor';

const HeaderDiv = styled.div`
    margin-top: 1em;
    padding-left: 1em;
`;

const goTopHeader = (
    <HeaderDiv>
        <IconNextLink LeftIcon={ChevronBack} href='/'>トップページ</IconNextLink>
    </HeaderDiv>
);

const Layout = ({
    children,
    title = 'hideo54 Lab',
    description = '新しいプロダクトにするほどでもないような、小さな制作物や研究結果を公開する場所。',
    imageUrl = 'https://img.hideo54.com/icons/main.png',
    twitterCardType = 'summary',
    header = goTopHeader,
}: {
    children?: ReactNode;
    title?: string;
    description?: string;
    imageUrl?: string;
    twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
    header?: JSX.Element;
}) => (
    <>
        <Head>
            <meta charSet='utf-8' />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            <meta name='description' content={description} />
            <meta key='og:site_name' property='og:site_name' content='hideo54 Lab' />
            <meta key='og:title' property='og:title' content={title} />
            <meta key='og:description' property='og:description' content={description} />
            {imageUrl &&
                <meta property='og:image' content={imageUrl} />
            }
            <meta key='twitter:card' name='twitter:card' content={twitterCardType} />
            <meta key='twitter:site' name='twitter:site' content='@hideo54' />
            <title>{title}</title>
            <link rel='icon' type='image/png' href='https://img.hideo54.com/icons/main.png' />
            <link rel='apple-touch-icon' href='https://img.hideo54.com/icons/main.png' />
        </Head>
        {header && <header>{header}</header>}
        <main>
            {children}
        </main>
    </>
);

export default Layout;
