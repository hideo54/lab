import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronBack, Open } from '@styled-icons/ionicons-outline';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import Layout from '../../components/Layout';
import prefecturesJson from '../../public/data/prefectures.json';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const ControlsDiv = styled.div`
    text-align: center;
    margin: 1em 0;
    div {
        margin: 1em 0;
        span.number {
            font-size: 1.2em;
        }
    }
    .x {
        font-size: 1.2em;
    }
`;

const Table = styled.table`
    margin: 0 auto;
    border-collapse: collapse;
    th, td {
        text-align: center;
        padding: 0.5em;
        &.number {
            font-size: 1.2em;
            &.zero {
                color: #888888;
            }
            &.positive {
                color: #d7033a;
                font-weight: bold;
            }
            &.negative {
                color: #0091ea;
                font-weight: bold;
            }
        }
        &.right {
            text-align: right;
        }
    }
    thead tr:last-child {
        border-bottom: 1px solid #888888;
    }
    tbody tr:nth-child(even) {
        background-color: #eeeeee;
        @media (prefers-color-scheme: dark) {
            background-color: #222222;
        }
    }
`;

const sum = (nums: number[]) => (
    nums.reduce((prev, cur) => prev + cur)
);

const describeNumberSign = (n: number) => (
    n === 0 ? 'zero number' : (
        n > 0 ? 'positive number' : 'negative number'
    )
);

const calcX = (populations: number[], idealSum: number) => {
    return 472500;
};

const Simulator: React.VFC = () => {
    const [numOfSeats, setNumOfSheats] = useState(289);
    const [x, setX] = useState(472500);
    const populations = prefecturesJson.map(pref => pref.population2020);
    const [populationsDivided, setPopulationsDivided] = useState(populations);
    const currentSeats = prefecturesJson.map(pref => pref.numberOfPrefSenkyoku2017);
    const currentSum = sum(currentSeats);
    const [numOfIncrease, setNumOfIncrease] = useState(0);
    const [numOfDecrease, setNumOfDecrease] = useState(0);
    const [numOfChangedPrefs, setNumOfChangedPrefs] = useState(0);
    useEffect(() => {
        const x = calcX(populations, numOfSeats);
        setX(x);
        const newPopulationsDivided = populations.map(p => Math.ceil(p / x));
        setPopulationsDivided(newPopulationsDivided);
        const changes = newPopulationsDivided.map((p, i) => p - currentSeats[i]);
        setNumOfIncrease(sum(changes.filter(n => n > 0)));
        setNumOfDecrease(-sum(changes.filter(n => n < 0)));
        setNumOfChangedPrefs(newPopulationsDivided.filter((p, i) => p !== currentSeats[i]).length);
    }, [numOfSeats]);
    return (
        <div>
            <ControlsDiv>
                <div className='x'>X = {x.toLocaleString()}</div>
                <div>増減: <span className='number'>{numOfIncrease}増{numOfDecrease}減</span></div>
                <div>増減のおこる都道府県の数: <span className='number'>{numOfChangedPrefs}</span></div>
            </ControlsDiv>
            <Table>
                <thead>
                    <tr>
                        <th>都道府県</th>
                        <th>人口 (2020)</th>
                        <th>現行<br />(2017, 2021)</th>
                        <th>適用後</th>
                        <th>増減</th>
                    </tr>
                    <tr>
                        <th>合計</th>
                        <th className='right'>{sum(populations).toLocaleString()}</th>
                        <th>{sum(prefecturesJson.map(pref => pref.numberOfPrefSenkyoku2017))}</th>
                        <th className='number'>{sum(populationsDivided)}</th>
                        <th>{sum(populationsDivided) - currentSum}</th>
                    </tr>
                </thead>
                <tbody>
                    {prefecturesJson.map((pref, i) => (
                        <tr key={i}>
                            <td>{pref.prefName}</td>
                            <td className='right'>{pref.population2020.toLocaleString()}</td>
                            <td>{pref.numberOfPrefSenkyoku2017}</td>
                            <td className='number'>{Math.ceil(pref.population2020 / x)}</td>
                            <td
                                className={
                                    describeNumberSign(populationsDivided[i] - pref.numberOfPrefSenkyoku2017)
                                }
                            >
                                {populationsDivided[i] - pref.numberOfPrefSenkyoku2017}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

const App: React.VFC = () => {
    return (
        <Layout
            title='アダムズ方式シミュレータ | hideo54 Lab'
            description='「一票の格差」是正のための議員定数配分で使われる「アダムス方式」。その配分のされかたを確認できるシミュレータです。'
            header={(
                <div style={{
                    marginTop: '1em',
                    paddingLeft: '1em',
                }}>
                    <IconNextLink LeftIcon={ChevronBack} href='/'>トップページ</IconNextLink>
                </div>
            )}
        >
            <H1>アダムズ方式シミュレータ</H1>
            <Simulator />
            <h2>注意</h2>
            <ul>
                <li>ご意見・ご感想・ご要望などあればhideo54へ。(Twitter: <IconAnchor RightIcon={Open} href='https://twitter.com/hideo54'>@hideo54</IconAnchor>)</li>
            </ul>
            <h2>クレジット</h2>
            <p>
                人口データは、e-Stat が提供する「
                <IconAnchor RightIcon={Open} href='https://www.senkyo.metro.tokyo.lg.jp/election/sanngiin-all/sanngiin-sokuhou2019/'>
                    国勢調査 / 令和2年国勢調査 / 人口等基本集計　（主な内容：男女・年齢・配偶関係，世帯の構成，住居の状態，母子・父子世帯，国籍など）
                </IconAnchor>
                」(00200521) データを利用しています。
            </p>
        </Layout>
    );
};

export default App;
