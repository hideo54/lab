import React, { useState } from 'react';
import { InferGetStaticPropsType } from 'next';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Legend, Tooltip, Brush } from 'recharts';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { IconAnchor } from '@hideo54/reactor';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import yaml from 'yaml';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Layout from '../../components/Layout';

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

interface Event {
    date: string;
    category: string;
    caption: string;
}

const categoryColor: {[key: string]: string} = {
    組閣: '#E50300',
    政治: '#16A085',
    事件: '#8A2BE2',
};

export const getStaticProps = async () => {
    const originalApprovalRateData = JSON.parse(
        await fs.readFile('./public/data/approval-rate.json', 'utf-8')
    ) as OriginalApprovalRateData[];
    dayjs.extend(customParseFormat);
    const approvalRateData = originalApprovalRateData.map(d => ({
        ...d,
        days: dayjs(d.day, 'M月D日').year(d.year).diff(dayjs('2009-09-01'), 'days'), // 2009/09/01 からの経過日数
    })).filter(d => d.days > 0);
    const eventsData = yaml.parse(
        await fs.readFile('./public/data/minshu-events.yml', 'utf-8')
    ) as Event[];
    const categorySelectedDefault = Object.fromEntries(
        eventsData.map(e => [ e.category, true])
    );
    return {
        props: { approvalRateData, eventsData, categorySelectedDefault },
    };
};

const GraphDiv = styled.div`
    height: 50vh;
    margin: 0 auto;
    text-align: center;
    .recharts-brush-slide {
        fill: #0091EA;
    }
    span.MuiIconButton-label > input { /* なぜか出る標準の checkbox (カス…) */
        display: none;
    }
`;

const ColoredCheckboxLabelSpan = styled.span<{ color: string; }>`
    svg.MuiSvgIcon-root {
        color: ${props => props.color};
    }
    span.MuiFormControlLabel-label {
        color: ${props => props.color};
    }
`;

const App = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const allCategories = new Set(props.eventsData.map(d => d.category));
    const [ categorySelected, setCategorySelected ] = useState(props.categorySelectedDefault);
    const lineChart = (
        <LineChart data={props.approvalRateData} margin={{ left: -20, right: 0, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray='5 5' />
            <XAxis
                dataKey='days'
                type='number'
                domain={['dataMin', 'dataMax']}
                tick={false}
            />
            <YAxis domain={[0, 80]} tickCount={9} tickFormatter={s => s + '%'} />
            <Legend verticalAlign='top' align='right' formatter={s =>
                s === 'approval' ? '支持する' : '支持しない'
            } />
            <Line type='monotone' dataKey='approval' stroke='#FF0000' />
            <Line type='monotone' dataKey='disapproval' stroke='#0000FF' />
            {props.eventsData.map(event => {
                if (!categorySelected[event.category]) return;
                const days = dayjs(event.date).diff('2009-09-01', 'days');
                return (
                    <ReferenceLine
                        key={event.caption}
                        x={days}
                        stroke={categoryColor[event.category]}
                        strokeOpacity={0.2}
                        strokeWidth={2}
                        label={{
                            value: event.caption,
                            angle: 90,
                            color: categoryColor[event.category],
                            fontWeight: 'bold',
                        }}
                    />
                );
            })}
            <Tooltip
                formatter={(value: string, name: string) => [ value + '%', name === 'approval' ? '支持する' : '支持しない']}
                labelFormatter={v => dayjs('2009-09-01').add(v, 'days').format('YYYY年M月D日')}
            />
            <Brush
                dataKey='days'
                startIndex={0}
                endIndex={12}
                travellerWidth={20}
                tickFormatter={n =>
                    dayjs('2009-09-01').add(n, 'days').format('YY年M月')
                }
            />
        </LineChart>
    );
    const checkboxes = Array.from(allCategories).map(category =>
        <ColoredCheckboxLabelSpan key={category} color={categoryColor[category]}>
            <FormControlLabel label={category} control={
                <Checkbox
                    name={category}
                    checked={categorySelected[category]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setCategorySelected({
                            ...categorySelected,
                            [event.target.name]: event.target.checked,
                        });
                    }}
                />
            } />
        </ColoredCheckboxLabelSpan>
    );
    return (
        <Layout
            title='民主党政権時の内閣支持率と主な出来事 | hideo54 Lab'
            description='民主党が政権を担っていた2009年9月から2012年12月の間の内閣支持率と主な出来事をグラフにまとめています。'
            imageUrl='https://lab.hideo54.com/images/approval-rate.png'
            twitterCardType='summary_large_image'
        >
            <H1>民主党政権時の内閣支持率と主な出来事</H1>
            <GraphDiv>
                <ResponsiveContainer>
                    {lineChart}
                </ResponsiveContainer>
                {checkboxes}
            </GraphDiv>
            <h2>制作動機</h2>
            <p>
                <IconAnchor RightIcon={Open} href='https://www.chuko.co.jp/shinsho/2013/09/102233.html'>
                    日本再建イニシアティブ『民主党政権 失敗の検証』(中公新書)
                </IconAnchor> を読んでいて、民主党政権時の内閣支持率と主な出来事をわかりやすく図示したグラフが欲しくなったことがきっかけです。
                <br />
                この本は、3年3ヶ月で幕を閉じた民主党政権の失敗の理由を、当時政権を担っていた議員や関係者に対する多数のインタビューを踏まえながら、各政策に注目して詳細に分析した本で、おすすめの一冊です。
            </p>
            <h2>注意</h2>
            <ul>
                <li>世論調査は通常数日かけて行われますが、今回はその期間の初日を調査日としています。たとえば、9月18日から20日にかけて行われた世論調査は、9月18日の世論調査として取り扱っています。</li>
                <li>グラフの曲線は、各点をなだらかに結ぶように描かれたものです。点の打たれていない部分において、曲線のとおり推移していたわけではありません。</li>
            </ul>
            <h2>クレジット</h2>
            <ul>
                <li>
                    内閣支持率のデータは、NHK放送文化研究所が公開している各年の<IconAnchor RightIcon={Open} href='https://www.nhk.or.jp/bunken/yoron/political/2009.html'>政治意識月例調査</IconAnchor>ページに掲載されているデータを利用しています。
                </li>
                <li>
                    出来事については、上述の『民主党政権 失敗の検証』の記述を適宜参考にしつつ、重要と思ったものを選んで載せています。また、同書が行った民主党衆議院議員へのアンケート内の「民主党政権が有権者の支持を失う決定的なターニングポイントはどの時期だと思いますか?」の質問の選択肢となっている出来事はすべて載せました。
                </li>
                <li>
                    出来事について、<IconAnchor RightIcon={Open} href='https://www.jiji.com/jc/graphics?p=ve_pol_election-syugiin20121124j-04-w680'>時事通信社『【図解・政治】衆院選・民主党政権3年の歩み (2012年11月)』(時事ドットコム)</IconAnchor> も参考にしました。
                </li>
            </ul>
        </Layout>
    );
};

export default App;
