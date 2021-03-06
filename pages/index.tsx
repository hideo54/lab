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
        <Layout header={<></>}>
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
                        <IconNextLink RightIcon={ChevronForward} href='/u-tokyo/party-approval-rate'>
                            東京大学新入生の政党支持
                        </IconNextLink>
                    </h2>
                    <p>東京大学新聞社 (東大新聞) が毎年新入生に対して行っている支持政党の調査の結果を経時的にまとめています。</p>
                </PageArticle>
                <PageArticle>
                    <h2>
                        <IconNextLink RightIcon={ChevronForward} href='/u-tokyo/newspapers'>
                            東京大学附属図書館 新聞所蔵リスト
                        </IconNextLink>
                    </h2>
                    <p>東京大学附属図書館が所蔵しているすべての新聞のリストを見やすくまとめています。急に地方紙や業界紙を読みたくなったときなどに便利です。</p>
                </PageArticle>
                <PageArticle>
                    <h2>
                        <IconNextLink RightIcon={ChevronForward} href='/senkyo/adams-simulator'>
                            アダムズ方式シミュレータ
                        </IconNextLink>
                    </h2>
                    <p>「一票の格差」是正のための議員定数配分で使われる「アダムス方式」。衆議院選挙の小選挙区制におけるその配分のされかたを確認できるシミュレータです。</p>
                </PageArticle>
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
