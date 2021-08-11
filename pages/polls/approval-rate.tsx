import styled from 'styled-components';
import { ChevronBack } from '@styled-icons/ionicons-solid';
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from 'recharts';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

interface PollData {
    month: number; // 仕方なく。2009年9月1日からの経過日数でよさそう。
    approval: number;
    disapproval: number;
}

const App = () => {
    const data: PollData[] = [
        {
            month: 9,
            approval: 80,
            disapproval: 10,
        },
        {
            month: 10,
            approval: 75,
            disapproval: 15,
        },
        {
            month: 11,
            approval: 65,
            disapproval: 25,
        },
        {
            month: 20,
            approval: 65,
            disapproval: 25,
        },
    ];
    return (
        <Layout
            title='民主党政権時の内閣支持率と主な出来事 | hideo54 Lab'
            description='民主党が政権を担っていた2009年9月から2012年12月の間の内閣支持率と主な出来事をグラフにまとめています。'
            imageUrl='https://lab.hideo54.com/images/approval-rate.png'
            twitterCardType='summary_large_image'
            header={(
                <div style={{
                    marginTop: '1em',
                    paddingLeft: '1em',
                }}>
                    <IconLink LeftIcon={ChevronBack} href='/'>トップページ</IconLink>
                </div>
            )}
        >
            <H1>民主党政権時の内閣支持率と主な出来事</H1>
            <p>Hello</p>
            <LineChart width={1000} height={200} data={data}>
                <XAxis dataKey='month' type='number' domain={['dataMin', 'dataMax']} />
                <YAxis />
                <Line type='monotone' dataKey='approval' stroke='#FF0000' />
                <ReferenceLine x={9.5} alwaysShow label='hoge' stroke='green' />
            </LineChart>
        </Layout>
    );
};

export default App;
