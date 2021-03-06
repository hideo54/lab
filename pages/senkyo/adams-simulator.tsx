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
    text-align: center;
`;

const Simulator: React.VFC = () => {
    const selectableYears = [2015, 2020, 2025, 2030, 2035, 2040, 2045];
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
        setPopulations(prefecturesJson.map(pref =>
            // @ts-expect-error ??????
            pref[[2015, 2020].includes(year) ? `population${year}` : `population${year}-est2018`]
        ));
    }, [year]);
    useEffect(() => {
        if (numOfSeats >= 48) { // 47 ??????????????????????????????
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
                <div>??????: {year}???{year > 2020 && ' (?????????)'}</div>
                <div>
                    <ColorfulSlider
                        value={year}
                        min={2015}
                        max={2045}
                        step={5}
                        color={year <= 2020 ? '#0091ea' : '#36c200'}
                        onChange={e => {
                            const newYear = e.target.valueAsNumber;
                            if ((selectableYears).includes(newYear)) {
                                setYear(newYear);
                            }
                        }}
                    />
                </div>
                <div>
                    <label htmlFor='seats'>?????????????????????:</label>
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
                                if (0 < value && value <= 999) {
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
                            48???????????????????????????????????????
                        </IconSpan>
                    }
                </div>
                <div>???</div>
                <div className='large bold'>????????????</div>
                <div>X ??? [{xRange.join(', ')}]</div>
                <div>??????: <span className='large'>{numOfIncrease}???{numOfDecrease}???</span></div>
                <div>????????????????????????????????????: <span className='large'>{numOfChangedPrefs}</span></div>
            </ControlsDiv>
            <hr />
            <Table>
                <thead>
                    <tr>
                        <th>????????????</th>
                        <th>??????{year > 2020 && '??????'}<br />({year})</th>
                        <th>??????<br />(2017, 2021)</th>
                        <th>?????????</th>
                        <th>??????</th>
                    </tr>
                    <tr>
                        <th>??????</th>
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
                            <td className='number'>{Math.ceil(populations[i] / xRange[0])}</td>
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
            title='???????????????????????????????????? | hideo54 Lab'
            description='????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'
        >
            <H1>????????????????????????????????????</H1>
            <Simulator />
            <h2>??????</h2>
            <ul>
                <li>
                    2015??????2020?????????????????????????????????????????????????????????????????????????????? [1][2]???
                </li>
                <li>
                    2025???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? [3]???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? [4]??????????????????????????????????????????????????????2018???????????????????????????
                </li>
                <li>
                    ????????????????????????????????????????????????{' '}
                    <IconAnchor RightIcon={Open} href='https://hideo54.com/'>
                        hideo54
                    </IconAnchor>{' '}
                    ??????
                </li>
            </ul>
            <h2>?????????????????????????</h2>
            <p>
                ????????????????????????X?????????????????????<strong>?????????????????????</strong>??????????????????????????????????????????????????????????????????X??????????????????
            </p>
            <p>
                ???????????????????????????????????????????????????????????? [5]???
            </p>
            <p>
                2016???1????????????????????????????????????????????????????????? [4]???2016???5????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? [6]???
                ?????????2021???11???30?????????????????????????????????????????????????????????????????????10???10?????????????????????????????????????????? [7]???
                2022???6?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? [7]???
            </p>
            <h2>????????????</h2>
            <ol>
                <li>
                    ?????????????????????????????? (e-Stat)????????????????????????????????????????????? (?????????)
                    ???
                    <IconAnchor RightIcon={Open} href='https://www.e-stat.go.jp/stat-search/files?stat_infid=000031473210'>
                        ???????????? / ??????27??????????????? / ??????????????????????????????????????????????????????????????????????????????????????????????????? ????????????
                    </IconAnchor>
                    ???
                </li>
                <li>
                    ?????????????????????????????? (e-Stat)????????????????????????????????????????????? (?????????)
                    ???
                    <IconAnchor RightIcon={Open} href='https://www.e-stat.go.jp/stat-search/files?stat_infid=000032142404'>
                        ???????????? / ??????2??????????????? / ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                    </IconAnchor>
                    ???
                </li>
                <li>
                    ????????????????????????????????????????????????????????????????????????????????? (??????30 (2018) ?????????)???
                    <IconAnchor RightIcon={Open} href='https://www.ipss.go.jp/pp-shicyoson/j/shicyoson18/t-page.asp'>?????????</IconAnchor>
                </li>
                <li>
                    <IconAnchor href='https://www.soumu.go.jp/main_sosiki/singi/senkyoku/02gyosei14_03000064.html' RightIcon={Open}>
                        ???5??????????????????????????????????????????
                    </IconAnchor>
                    ??????????????????????????????????????????????????????2016???1???.{' '}
                    <IconAnchor href='https://www.soumu.go.jp/main_content/000395085.pdf' RightIcon={Open}>PDF</IconAnchor>
                </li>
                <li>
                    ????????????, ??????????????????????????????????????????????????? ?????????????????????????????????, ?????????????????????????????????, Vol. 27 No. 3, 2017.{' '}
                    <IconAnchor href='https://www.jstage.jst.go.jp/article/jsiamt/27/3/27_261/_pdf' RightIcon={Open}>PDF</IconAnchor>
                </li>
                <li>
                    ???????????????????????????????????????????????????????????????2016???5???27???.{' '}
                    <IconAnchor RightIcon={Open} href='https://www.soumu.go.jp/senkyo/senkyo_s/news/senkyo/shu_seido/index.html'>?????????</IconAnchor>
                </li>
                <li>
                    NHK???????????? ??????10???10??????????????? ????????????????????? ??????????????????????????? 2021???11???30???.{' '}
                    <IconAnchor href='https://www3.nhk.or.jp/news/html/20211130/k10013368091000.html' RightIcon={Open}>?????????</IconAnchor>
                </li>
            </ol>
        </Layout>
    );
};

export default App;
