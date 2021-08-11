import styled from 'styled-components';
import { ChevronForward } from '@styled-icons/ionicons-outline';
import { Flask } from '@styled-icons/ionicons-solid';
import Layout from '../components/Layout';
import { IconLink } from '../components/atoms';

const HeaderSection = styled.section`
    margin-bottom: 3em;
    text-align: center;
    div.flask {
        padding: 1em;
    }
`;

const CatchH1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 100;
    div {
        font-size: 2em;
        line-height: 1.2;
    }
`;

const PageArticle = styled.article`
    margin: 1em 0;
    border: 2px solid gray;
    border-radius: 20px;
    padding: 1em;
    h2 {
        font-family: 'Noto Sans JP', sans-serif;
    }
`;

interface PageMeta {
    title: string;
    caption: string;
    path: string;
}

const pages: PageMeta[] = [
    {
        title: '民主党政権時の内閣支持率と主な出来事',
        caption: '民主党が政権を担っていた2009年9月から2012年12月の間の内閣支持率と主な出来事をグラフにまとめています。',
        path: '/polls/approval-rate',
    },
    {
        title: '2019年参院選における東京都の地区別投票傾向',
        caption: 'ひとくちに東京都と言っても、地区ごとにみると、その投票傾向は少しずつ違っています。2019年に行われた参院選の開票結果を使って、その傾向をヴィジュアライズしています。',
        path: '/senkyo/san-2019-tokyo',
    },
];

const App = () => {
    return (
        <Layout>
            <HeaderSection>
                <div className='flask'>
                    <Flask size='200px' color='silver' />
                </div>
                <CatchH1>
                    Welcome to
                    <div>hideo54 Lab</div>
                </CatchH1>
                <p>小さな制作物や研究結果を公開します。</p>
            </HeaderSection>
            {pages.map(page => (
                <PageArticle key={page.path}>
                    <h2>
                        <IconLink RightIcon={ChevronForward} href={page.path}>{page.title}</IconLink>
                    </h2>
                    <p>{page.caption}</p>
                </PageArticle>
            ))}
        </Layout>
    );
};

export default App;
