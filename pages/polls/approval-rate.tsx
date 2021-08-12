import { InferGetStaticPropsType } from 'next';
import styled from 'styled-components';
import { ChevronBack, Open } from '@styled-icons/ionicons-outline';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, Brush } from 'recharts';
import fs from 'fs/promises';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

interface OriginalApprovalRateData {
    year: number;
    month: number;
    day: string;
    approval: number;
    disapproval: number;
}

export const getStaticProps = async () => {
    const dataStr = await fs.readFile('./public/data/approval-rate.json', 'utf-8');
    const originalApprovalRateData = JSON.parse(dataStr) as OriginalApprovalRateData[];
    dayjs.extend(customParseFormat);
    const approvalRateData = originalApprovalRateData.map(d => ({
        ...d,
        days: dayjs(d.day, 'M月D日').year(d.year).diff(dayjs('2009-09-01'), 'days'), // 2009/09/01 からの経過日数
    })).filter(d => d.days > 16);
    return {
        props: { approvalRateData },
    };
};

const App = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const data = props.approvalRateData;
    const lineChart = (
        <LineChart data={data}>
            <XAxis
                dataKey='days'
                type='number'
                domain={['dataMin', 'dataMax']}
                tick={false}
            />
            <YAxis
                domain={[0, 80]}
                label={{ value: '%', position: 'insideLeft' }} tickCount={9}
            />
            <Line type='monotone' dataKey='approval' stroke='#FF0000' />
            <Line type='monotone' dataKey='disapproval' stroke='#0000FF' />
            <ReferenceLine label='hoge' x={20} />
            <Brush
                dataKey='days'
                startIndex={0}
                endIndex={6}
                tickFormatter={n =>
                    dayjs('2009-09-01').add(n, 'days').format('YY年M月')
                }
            />
        </LineChart>
    );
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
            <div style={{ height: '70vh' }}>
                <ResponsiveContainer>
                    {lineChart}
                </ResponsiveContainer>
            </div>
            <h2>クレジット</h2>
            <p>
                内閣支持率のデータは、NHK放送文化研究所が公開している各年の<IconLink RightIcon={Open} href='https://www.nhk.or.jp/bunken/yoron/political/2009.html'>政治意識月例調査</IconLink>ページに掲載されているデータを利用しています。
            </p>
        </Layout>
    );
};

export default App;
