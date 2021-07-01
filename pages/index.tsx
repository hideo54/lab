import styled from 'styled-components';
import { Flask } from '@styled-icons/ionicons-solid';
import Layout from '../components/Layout';

const HeadDiv = styled.div`
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

const App = () => {
    return (
        <Layout>
            <HeadDiv>
                <div style={{
                    padding: '1em',
                }}>
                    <Flask size='200px' color='silver' />
                </div>
                <CatchH1>
                    Welcome to
                    <div>hideo54 Lab</div>
                </CatchH1>
                <p>小さな制作物や研究結果を公開しています。</p>
            </HeadDiv>
        </Layout>
    );
};

export default App;
