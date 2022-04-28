import React, { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import Layout from '../../components/Layout';
import pollsJson from '../../public/data/todaishimbun-polls.json';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const Graph = () => {
    const [isContinuent, setIsContinuent] = useState(false);
    const [shouldZoom, setShouldZoom] = useState(false);
    const [shouldConnectRikken, setShouldConnectRikken] = useState(false);
    const allData = pollsJson['party-approval'].map(d => ({
        year: d.year,
        method: d.method,
        ...(shouldConnectRikken
            ? Object.fromEntries(
                Object.entries(d.rate).map(([partyId, rate]) =>
                    [partyId.replace(/-\d+$/, ''), rate]
                )
            ) : d.rate
        ),
    })).reverse();
    const formatter = (v: string) => {
        if (v === 'none') return '支持政党なし';
        if (v === 'jimin') return '自由民主党';
        if (v === 'rikken-minshu') return '立憲民主党';
        if (v === 'rikken-minshu-2017') return '立憲民主党 (2017 - 2020)';
        if (v === 'kokumin-minshu') return '国民民主党';
        if (v === 'kokumin-minshu-2018') return '国民民主党 (2018 - 2020)';
        if (v === 'minshin') return '民進党';
        if (v === 'ishin') return '日本維新の会';
        if (v === 'kyosan') return '日本共産党';
        return v;
    };
    const getColor = (partyId: string) => {
        if (partyId === 'jimin') return '#d7033a';
        if (partyId === 'minshin') return '#004098';
        if (partyId.includes('rikken-minshu')) return '#004098';
        if (partyId.includes('kokumin-minshu')) return '#f8bc00';
        if (partyId === 'ishin') return '#36c200';
        if (partyId === 'kyosan') return '#7957da';
        return '#777777';
    };
    const dataKey = (partyId: string, method: string) => (
        (e: typeof allData[number]) =>
            e.method === method
                ? e[partyId as keyof typeof allData[number]]
                : null
    );
    const makeLines = (partyId: string) => ( // React component にするとなぜか動かない
        isContinuent ? (
            <Line
                type='monotone'
                dataKey={partyId}
                stroke={getColor(partyId)}
            />
        ) : (
            <>
                <Line
                    type='monotone'
                    dataKey={dataKey(partyId, 'onsite')}
                    name={formatter(partyId)}
                    stroke={getColor(partyId)}
                    legendType='none'
                />
                <Line
                    type='monotone'
                    dataKey={dataKey(partyId, 'online')}
                    name={formatter(partyId)}
                    stroke={getColor(partyId)}
                />
            </>
        )
    );
    return (
        <div>
            <label>
                <input
                    type='checkbox'
                    checked={isContinuent}
                    onChange={e => setIsContinuent(e.target.checked)}
                />
                オンライン調査を連続して表示する
            </label>
            <label>
                <input
                    type='checkbox'
                    checked={shouldZoom}
                    onChange={e => setShouldZoom(e.target.checked)}
                />
                15%以下を拡大
            </label>
            <label>
                <input
                    type='checkbox'
                    checked={shouldConnectRikken}
                    onChange={e => setShouldConnectRikken(e.target.checked)}
                />
                旧新立憲民主党・国民民主党を連続して表示する
            </label>
            <ResponsiveContainer width='100%' height={500}>
                <LineChart data={allData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='year' />
                    <YAxis
                        type='number'
                        domain={shouldZoom ? [0, 15] : [0, 'auto']}
                        allowDataOverflow={true}
                        unit='%'
                    />
                    <Tooltip formatter={formatter} />
                    <Legend layout='horizontal' formatter={formatter} />
                    {makeLines('none')}
                    {makeLines('jimin')}
                    {makeLines('minshin')}
                    {makeLines('rikken-minshu-2017')}
                    {makeLines('rikken-minshu')}
                    {makeLines('kokumin-minshu-2018')}
                    {makeLines('kokumin-minshu')}
                    {makeLines('ishin')}
                    {makeLines('kyosan')}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const App = () => {
    return (
        <Layout
            title='東大新入生の政党支持 | hideo54 Lab'
            description='東京大学新聞社 (東大新聞) が毎年新入生に対して行っている支持政党の調査の結果を経時的にまとめています。'
        >
            <H1>東大新入生の政党支持</H1>
            <Graph />
            <h2>ソース</h2>
            <ul>
                {/* <li>2016年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/survey20160420/'>東大新入生、自民党支持は3割 民進党は4% | 東大新聞オンライン</IconAnchor></li> */}
                <li>2017年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/survey20170422/'>東大新入生アンケート2017② 支持政党は自民36%、民進3.4% 無支持は4%減 | 東大新聞オンライン</IconAnchor></li>
                <li>2018年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/survey20180428/'>【新入生アンケート2018 ④社会問題】憲法に自衛隊明記「賛成」52% | 東大新聞オンライン</IconAnchor></li>
                <li>2019年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/questionnaire20190425/'>新入生アンケート2019分析① 32.5%が「学生の男女比問題なし」 自民党支持率は低下 | 東大新聞オンライン</IconAnchor></li>
                <li>2020年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/enquate2020_4_20200504/'>新入生アンケート2020分析④ 社会問題編 オリ委員による「東大女子お断り」サークルの新歓制限「適切」78% | 東大新聞オンライン</IconAnchor></li>
                <li>2021年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/questionnaire0422/'>【新入生アンケート2021】77%が対面授業を希望 今年の新入生の傾向とは？ | 東大新聞オンライン</IconAnchor></li>
                <li>2022年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/questionnaire_20220426/'> 【新入生アンケート2022 ④社会問題】対面授業中心84%で最多 | 東大新聞オンライン</IconAnchor></li>
            </ul>
        </Layout>
    );
};

export default App;
