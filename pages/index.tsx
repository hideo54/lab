import styled from 'styled-components';
import { ChevronForward } from '@styled-icons/ionicons-outline';
import { Flask } from '@styled-icons/ionicons-solid';
import { IconNextLink } from '@hideo54/reactor';
import Layout from '../components/Layout';

const HeaderSection = styled.section`
    margin-bottom: 3em;
    text-align: center;
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
    margin: 2em 0;
    border-radius: 20px;
    padding: 1em;
    box-shadow: 0 0 10px #CCCCCC;
    @media (prefers-color-scheme: dark) {
        background-color: #111111;
        box-shadow: 0 0 10px #444444;
    }
    h2 {
        font-family: 'Noto Sans JP', sans-serif;
    }
`;

const App = () => {
    return (
        <Layout>
            <HeaderSection>
                <div style={{
                    padding: '1em',
                }}>
                    <Flask size='200px' color='silver' />
                </div>
                <CatchH1>
                    Welcome to
                    <div>hideo54 Lab</div>
                </CatchH1>
                <p>小さな制作物や研究結果を公開します。</p>
            </HeaderSection>
            <section>
                <PageArticle>
                    <h2>
                        <IconNextLink RightIcon={ChevronForward} href='/senkyo/san-2019-tokyo'>
                            2019年参院選における東京都の地区別投票傾向
                        </IconNextLink>
                    </h2>
                    <p>ひとくちに東京都と言っても、地区ごとにみると、その投票傾向は少しずつ違っています。2019年に行われた参院選の開票結果を使って、その傾向をヴィジュアライズしています。</p>
                </PageArticle>
            </section>
        </Layout>
    );
};

export default App;
