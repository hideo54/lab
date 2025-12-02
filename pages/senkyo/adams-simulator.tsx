import React from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const App: React.VFC = () => {
    return (
        <Layout
            title='アダムズ方式シミュレータ | hideo54 Lab'
            description='「一票の格差」是正のための議員定数配分で使われる「アダムス方式」。衆議院選挙の小選挙区制におけるその配分のされかたを確認できるシミュレータです。'
        >
            <H1>アダムズ方式シミュレータ</H1>
            <p>
                <a href='https://senkyo.watch/tools/adams-simulator' target='_blank' rel='noopener noreferrer'>
                    https://senkyo.watch/tools/adams-simulator
                </a>
                に移動しました。
            </p>
        </Layout>
    );
};

export default App;
