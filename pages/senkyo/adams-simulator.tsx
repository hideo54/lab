import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AlertCircle, Open } from '@styled-icons/ionicons-outline';
import { IconSpan, IconAnchor, ColorfulSlider } from '@hideo54/reactor';
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
    }
    .large {
        font-size: 1.2em;
    }
    .bold {
        font-weight: bold;
    }
    input[type=range] {
        max-width: 300px;
    }
`;

const Table = styled.table`
    margin: 0 auto;
    margin-top: 2em;
    border-collapse: collapse;
    th, td {
        text-align: center;
        padding: 0.5em 0.25em;
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
    thead {
        position: sticky;
        top: 0;
        background-color: #ffffff;
        @media (prefers-color-scheme: dark) {
            background-color: #000000;
        }
        tr:last-child {
            border-bottom: 1px solid #888888;
        }
    }
    tbody tr:nth-child(even) {
        background-color: #eeeeee;
        @media (prefers-color-scheme: dark) {
            background-color: #222222;
        }
    }
`;

const sum = (nums: number[]) => (
    nums.reduce((prev, cur) => prev + cur, 0)
);

const describeNumberSign = (n: number) => (
    n === 0 ? 'zero number' : (
        n > 0 ? 'positive number' : 'negative number'
    )
);

const bisect = (populations: number[], idealSum: number) => {
    let min =     100_000;
    let max = 100_000_000;
    let biggest = Math.floor((min + max) / 2);
    const calcSumOfDivided = (x: number) => sum(populations.map(p => Math.ceil(p / x)));
    let counter = 0;
    while (counter < 30) {
        if (calcSumOfDivided(biggest) > idealSum) {
            min = biggest;
            biggest = Math.floor((min + max) / 2);
        } else if (calcSumOfDivided(biggest) < idealSum) {
            max = biggest;
            biggest = Math.floor((min + max) / 2);
        } else {
            if (calcSumOfDivided(biggest + 1) > idealSum - 1) {
                min = biggest;
                biggest = Math.floor((min + max) / 2);
            } else if (calcSumOfDivided(biggest + 1) < idealSum - 1) {
                max = biggest;
                biggest = Math.floor((min + max) / 2);
            } else {
                break;
            }
        }
        counter += 1;
    }
    return biggest;
};

const calcXRange = (populations: number[], idealSum: number) => {
    const to = bisect(populations, idealSum);
    const from = bisect(populations, idealSum + 1) + 1;
    return [from, to];
};

const SeatsInput = styled.input.attrs({
    type: 'number',
})`
    font-size: 1.2em;
    width: 3.6em;
    margin-left: 0.5em;
    text-align: right;
`;

const Simulator: React.VFC = () => {
    const [year, setYear] = useState(2020);
    const [numOfSeats, setNumOfSeats] = useState(289);
    const [xRange, setXRange] = useState<[number, number]>([472108, 474964]);
    const [populations, setPopulations] = useState(
        prefecturesJson.map(pref => pref.population2020)
    );
    const [populationsDivided, setPopulationsDivided] = useState(
        populations.map(p => Math.ceil(p / xRange[0]))
    );
    const currentSeats = prefecturesJson.map(pref => pref.numberOfPrefSenkyoku2017);
    const currentSum = sum(currentSeats);
    const [numOfIncrease, setNumOfIncrease] = useState(10);
    const [numOfDecrease, setNumOfDecrease] = useState(10);
    const [numOfChangedPrefs, setNumOfChangedPrefs] = useState(15);
    useEffect(() => {
        if (year === 2015) {
            setPopulations(prefecturesJson.map(pref =>pref.population2015));
        } else {
            setPopulations(prefecturesJson.map(pref =>
                Math.round(
                    ((pref.population2020 / pref.population2015) ** ((year - 2020) / 5)) * pref.population2020
                )
            ));
        }
    }, [year]);
    useEffect(() => {
        if (numOfSeats >= 47) {
            const [xFrom, xTo] = calcXRange(populations, numOfSeats);
            setXRange([xFrom, xTo]);
            const newPopulationsDivided = populations.map(p => Math.ceil(p / xFrom));
            setPopulationsDivided(newPopulationsDivided);
            const changes = newPopulationsDivided.map((p, i) => p - currentSeats[i]);
            setNumOfIncrease(sum(changes.filter(n => n > 0)));
            setNumOfDecrease(-sum(changes.filter(n => n < 0)));
            setNumOfChangedPrefs(newPopulationsDivided.filter((p, i) => p !== currentSeats[i]).length);
        }
    }, [numOfSeats, populations]);
    return (
        <div>
            <ControlsDiv>
                <div>人口: {year}年{year > 2020 && ' (単純予測値)'}</div>
                <div>
                    <ColorfulSlider
                        value={year}
                        min={2015}
                        max={2050}
                        step={5}
                        color={year <= 2020 ? '#0091ea' : '#36c200'}
                        onChange={e => {
                            const newYear = e.target.valueAsNumber;
                            if (!isNaN(newYear)) {
                                setYear(newYear);
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor='seats'>衆院小選挙区数</label>
                    <SeatsInput
                        type='number'
                        id='seats'
                        name='seats'
                        value={numOfSeats > 0 ? numOfSeats : ''}
                        inputMode='numeric'
                        onChange={e => {
                            if (e.target.value.includes('.')) return;
                            const value = parseInt(e.target.value);
                            if (isNaN(value)) {
                                if (e.target.value === '') {
                                    setNumOfSeats(0);
                                }
                            } else {
                                if (0 < value && value < 999) {
                                    setNumOfSeats(value);
                                }
                            }
                        }}
                        required
                    />
                </div>
                <div>
                    {numOfSeats < 48 &&
                        <IconSpan LeftIcon={AlertCircle} color='#d7033a'>
                            48以上の数字を入れてください
                        </IconSpan>
                    }
                </div>
                <div>↓</div>
                <div className='large bold'>計算結果</div>
                <div>X ∈ [{xRange.join(', ')}]</div>
                <div>増減: <span className='large'>{numOfIncrease}増{numOfDecrease}減</span></div>
                <div>増減のおこる都道府県の数: <span className='large'>{numOfChangedPrefs}</span></div>
            </ControlsDiv>
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th>都道府県</th>
                        <th>人口{year > 2020 && '予測'}<br />({year})</th>
                        <th>現行<br />(2017, 2021)</th>
                        <th>適用後</th>
                        <th>増減</th>
                    </tr>
                    <tr>
                        <th>合計</th>
                        <th className='right'>{sum(populations).toLocaleString()}</th>
                        <th>{sum(prefecturesJson.map(pref => pref.numberOfPrefSenkyoku2017))}</th>
                        <th className='number'>{sum(populationsDivided)}</th>
                        <th className={describeNumberSign(sum(populationsDivided) - currentSum)}>
                            {sum(populationsDivided) - currentSum}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {prefecturesJson.map((pref, i) => (
                        <tr key={i}>
                            <td>{pref.prefName}</td>
                            <td className='right'>{populations[i].toLocaleString()}</td>
                            <td>{pref.numberOfPrefSenkyoku2017}</td>
                            <td className='number'>{Math.ceil(pref.population2020 / xRange[0])}</td>
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
        >
            <H1>アダムズ方式シミュレータ</H1>
            <Simulator />
            <h2>注意</h2>
            <ul>
                <li>
                    2015年、2020年の人口データは、国勢調査による実数を使用しています (出典は下記)。
                </li>
                <li>
                    2025年以降の人口の数字は、2015年から2020年の増加率が一定のまま続くという過程による、極めて単純なモデルによる予測値を用いています。たとえば、2015年に人口1,000万人、2020年に人口900万人となった都道府県は、2025年に810万人、2030年に729万人になるとしています。
                </li>
                <li>
                    ご意見・ご感想・ご要望などあればhideo54へ。(Twitter: <IconAnchor RightIcon={Open} href='https://twitter.com/hideo54'>@hideo54</IconAnchor>)
                </li>
            </ul>
            <h2>クレジット</h2>
            <p>
                2020年の人口データは、政府統計の総合窓口 e-Stat が提供する「
                <IconAnchor RightIcon={Open} href='https://www.e-stat.go.jp/stat-search/files?stat_infid=000032142404'>
                    国勢調査 / 令和2年国勢調査 / 人口等基本集計（主な内容：男女・年齢・配偶関係，世帯の構成，住居の状態，母子・父子世帯，国籍など）
                </IconAnchor>
                」データを利用しています。
            </p>
            <p>
                2015年の人口データは、政府統計の総合窓口 e-Stat が提供する「
                <IconAnchor RightIcon={Open} href='https://www.e-stat.go.jp/stat-search/files?stat_infid=000031473210'>
                    国勢調査 / 平成27年国勢調査 / 人口等基本集計（男女・年齢・配偶関係，世帯の構成，住居の状態など） 全国結果
                </IconAnchor>
                」データを利用しています。
            </p>
        </Layout>
    );
};

export default App;
