import React, { useState } from 'react';
import { InferGetStaticPropsType } from 'next';
import styled from 'styled-components';
import { ChevronBack, Open } from '@styled-icons/ionicons-outline';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Legend, Brush } from 'recharts';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import dayjs from 'dayjs';
import fs from 'fs/promises';
import yaml from 'yaml';
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

interface Event {
    date: string;
    category: string;
    caption: string;
}

export const getStaticProps = async () => {
    const originalApprovalRateData = JSON.parse(
        await fs.readFile('./public/data/approval-rate.json', 'utf-8')
    ) as OriginalApprovalRateData[];
    dayjs.extend(customParseFormat);
    const approvalRateData = originalApprovalRateData.map(d => ({
        ...d,
        days: dayjs(d.day, 'M月D日').year(d.year).diff(dayjs('2009-09-01'), 'days'), // 2009/09/01 からの経過日数
    })).filter(d => d.days > 16);
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
                    <ReferenceLine x={days} label={{
                        value: event.caption,
                        angle: 90,
                    }} />
                );
            })}
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
        <FormControlLabel key={category} label={category} control={
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
            <div style={{ height: '50vh', margin: '0 auto' }}>
                <ResponsiveContainer>
                    {lineChart}
                </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center' }}>
                {checkboxes}
            </div>
            <h2>制作動機</h2>
            <p>
                <IconLink RightIcon={Open} href='https://www.chuko.co.jp/shinsho/2013/09/102233.html'>
                    日本再建イニシアティブ『民主党政権 失敗の検証』(中公新書)
                </IconLink> を読んでいて、民主党政権時の内閣支持率と主な出来事をわかりやすく図示したグラフが欲しくなったことがきっかけです。
                <br />
                この本は、3年3ヶ月で幕を閉じた民主党政権の失敗の理由を、当時政権を担っていた議員や関係者に対する多数のインタビューを踏まえながら、各政策に注目して詳細に分析した本で、おすすめの一冊です。
            </p>
            <h2>注意</h2>
            <ul>
                <li>グラフの曲線は、各点をなだらかに結ぶように描かれたものです。点の打たれていない部分において、曲線のとおり推移していたわけではありません。</li>
            </ul>
            <h2>クレジット</h2>
            <p>
                内閣支持率のデータは、NHK放送文化研究所が公開している各年の<IconLink RightIcon={Open} href='https://www.nhk.or.jp/bunken/yoron/political/2009.html'>政治意識月例調査</IconLink>ページに掲載されているデータを利用しています。
            </p>
        </Layout>
    );
};

export default App;
