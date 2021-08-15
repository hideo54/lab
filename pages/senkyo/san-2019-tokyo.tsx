import React, { useState, createRef, useEffect } from 'react';
import Link from 'next/link';
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Slider, Checkbox, Button } from '@material-ui/core';
import styled from 'styled-components';
import { WikipediaW } from '@styled-icons/fa-brands';
import { ChevronBack, Open } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';
import yukenshasu from '../../public/data/san-2019-tokyo-yukenshasu.json';
import votes from '../../public/data/san-2019-tokyo-votes.json';
import votesPercent from '../../public/data/san-2019-tokyo-percent.json';
import districtNameDict from '../../public/data/tokyo-district-name-dict.json';
import MapOfTokyo from '../../public/images/Map_of_Tokyo_Ja.svg';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const ControlsDiv = styled.div`
    margin: 2em 0;
    padding: 0 1em;
    text-align: center;
`;

const MapDiv = styled.div`
    text-align: center;
`;

const IslandsDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 40px;
    border: 1px solid #333333;
    margin-left: auto;
    cursor: pointer;
`;

const mainViewbox = '28 12 747 375';
const tokubetsukuViewbox = '501 89 275 279';
const tokubetsukuIds = [
    'chiyoda', 'chuo', 'minato', 'shinjuku', 'bunkyo', 'taito', 'sumida', 'koto', 'shinagawa', 'meguro', 'ota', 'setagaya', 'shibuya', 'nakano', 'suginami', 'toshima', 'kita', 'arakawa', 'itabashi', 'nerima', 'adachi', 'katsushika', 'edogawa',
] as const;
const tokaIds = [
    'hachioji', 'tachikawa', 'musashino', 'mitaka', 'ome', 'fuchu', 'akishima', 'chofu', 'machida', 'koganei', 'kodaira', 'hino', 'higashimurayama', 'kokubunji', 'kunitachi', 'fussa', 'komae', 'higashiyamato', 'kiyose', 'higashikurume', 'musashimurayama', 'tama', 'inagi', 'hamura', 'akiruno', 'nishitokyo', 'mizuho', 'hinode', 'hinohara', 'okutama', 'toshobu',
] as const;
const parties = ['自由民主党', '立憲民主党', '公明党', '日本維新の会', '日本共産党', '国民民主党', 'れいわ新選組', '社会民主党', 'NHKから国民を守る党'] as const;

const generateColor = (v: number) => { // v: 0 - 1
    const clamp = (x: number) => {
        if (x < 0) return 0;
        if (x > 1) return 1;
        return x;
    };
    const t = v * 2 - 1; // v: (0, 1) -> t: (-1, 1)
    const r = (t: number) => clamp(1.5 - Math.abs(2 * t - 1));
    const g = (t: number) => clamp(1.5 - Math.abs(2 * t));
    const b = (t: number) => clamp(1.5 - Math.abs(2 * t + 1));
    return '#' + [r, g, b].map(f =>
        ('00' + Math.floor(f(t) * 255).toString(16)).slice(-2)
    ).join('');
    // https://stackoverflow.com/a/46628410/5864292
};

const RangeSlider = styled(Slider)`
    margin-top: 3em;
    span.MuiSlider-track {
        background: linear-gradient(to right, #00007f, #004cff, #19ffe5, #e5ff19, #ff4c00, #7f0000);
        // 0, 0.2, ..., 1.0 で generateColor した
    }
    span.MuiSlider-thumb {
        &, span.MuiSlider-valueLabel > span {
            color: blue;
        }
    }
    span.MuiSlider-thumb:last-child {
        &, span.MuiSlider-valueLabel > span {
            color: red;
        }
    }
`;

const App = () => {
    const [party, setParty] = useState<typeof parties[number]>('自由民主党');
    const [range, setRange] = useState([0, 50]);
    const [showTokubetsukuOnly, setShowTokubetsukuOnly] = useState(false);
    const [selectedId, setSelectedId] = useState<keyof typeof votesPercent | null>(null);
    const handlePartyChange = (event: React.ChangeEvent<{ value: typeof parties[number] }>) => {
        setParty(event.target.value);
    };
    const handleRangeChange = (event: unknown, newValue: number[]) => {
        setRange(newValue);
    };
    const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowTokubetsukuOnly(event.target.checked);
    };
    const tokubetsukuCheckbox = <Checkbox checked={showTokubetsukuOnly} onChange={handleTargetChange} />;
    const targetIds = [...tokubetsukuIds, ...(showTokubetsukuOnly ? [] : tokaIds)];
    const svgRef = createRef<SVGElement>();
    useEffect(() => {
        targetIds.map(id => {
            const path = svgRef.current.querySelector(`#Map_of_Tokyo_Ja_svg__${id}`) as SVGPathElement;
            path.style.fill = generateColor((100 * votesPercent[id][party] - range[0]) / (range[1] - range[0]));
        });
        if (!showTokubetsukuOnly) {
            const islands = document.getElementById('toshobu');
            const islandsV = (100 * votesPercent['toshobu'][party] - range[0]) / (range[1] - range[0]);
            islands.style.backgroundColor = generateColor(islandsV);
            islands.style.color = 0.3 < islandsV && islandsV < 0.74 ? '#333333' : 'white';
        }
    }, [ party, range, showTokubetsukuOnly ]);
    useEffect(() => {
        targetIds.map(id => {
            const path = svgRef.current.querySelector(`#Map_of_Tokyo_Ja_svg__${id}`) as SVGPathElement;
            path.onclick = e => {
                const id = (e.target as SVGPathElement).id.slice('Map_of_Tokyo_Ja_svg__'.length) as typeof targetIds[number];
                setSelectedId(id);
            };
        });
    }, []);
    useEffect(() => {
        const copiedElements = document.getElementsByClassName('copy');
        Array.prototype.forEach.call(copiedElements, e => { e.remove(); });
        if (selectedId && selectedId !== 'all') {
            const root = document.getElementById('Map_of_Tokyo_Ja_svg__main');
            const selected = document.getElementById('Map_of_Tokyo_Ja_svg__' + selectedId);
            const selectedCopy = selected.cloneNode() as SVGPathElement;
            selectedCopy.style.strokeWidth = '5';
            selectedCopy.style.strokeLinejoin = 'round';
            // selectedCopy.style.stroke = 'white'; // いい色がわからん
            selectedCopy.style.fillOpacity = '0';
            selectedCopy.classList.add('copy');
            root.appendChild(selectedCopy);
        }
        const islands = document.getElementById('toshobu');
        islands.style.borderWidth = selectedId === 'toshobu' ? '5px' : '1px';
    }, [selectedId]);
    return (
        <Layout
            title='2019年参院選における東京都の区画別投票傾向分析 | hideo54 Lab'
            description='2019年に行われた参院選の開票結果を使って、東京都の区画別の投票傾向をヴィジュアライズしています。'
            imageUrl='https://lab.hideo54.com/images/san-2019-tokyo.png'
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
            <H1>2019年参院選における東京都の区画別投票傾向</H1>
            <ControlsDiv>
                <FormControl variant='outlined'>
                    <InputLabel id='party'>政党</InputLabel>
                    <Select value={party} onChange={handlePartyChange} labelId='party' label='政党'>
                        {parties.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </FormControl>
                <RangeSlider value={range} onChange={handleRangeChange} max={50} valueLabelDisplay='on' />
                <FormControlLabel control={tokubetsukuCheckbox} label='特別区のみを表示' />
            </ControlsDiv>
            <MapDiv>
                <MapOfTokyo viewBox={showTokubetsukuOnly ? tokubetsukuViewbox : mainViewbox} ref={svgRef} style={{
                    maxHeight: '50vh',
                }} />
            </MapDiv>
            {showTokubetsukuOnly || <IslandsDiv id='toshobu' onClick={() => { setSelectedId('toshobu'); }}>島しょ部</IslandsDiv>}
            <h2>選択中の区画: {selectedId ? districtNameDict[selectedId] : 'なし'}</h2>
            {selectedId ? <></> : <p>都全体の数字:</p>}
            <ul>
                <li>当時の有権者数: {yukenshasu[selectedId || 'all'].toLocaleString()}</li>
                <li>投票数: {votes[selectedId || 'all']['all'].toLocaleString()}</li>
                <li>比例代表における{party}の得票数: {votes[selectedId || 'all'][party].toLocaleString()}</li>
                <li>比例代表における{party}の得票率: {Math.round(votesPercent[selectedId || 'all'][party] * 1000) / 10}%</li>
            </ul>
            {selectedId ? (
                <Button onClick={() => { setSelectedId(null); }}>選択を解除</Button>
            ) : (
                <>
                    <p>地図上の区画を選択すると詳細な数字を表示します。</p>
                </>
            )}
            <style>{`
                #Map_of_Tokyo_Ja_svg__main {
                    fill: white;
                    stroke: #333333;
                    stroke-width: 0.5;
                }
                ${showTokubetsukuOnly ? '#Map_of_Tokyo_Ja_svg__toka,' : ''} #Map_of_Tokyo_Ja_svg__toshobu, #Map_of_Tokyo_Ja_svg__lakes, #Map_of_Tokyo_Ja_svg__outside {
                    display: none;
                }
                svg path {
                    cursor: pointer;
                }
                .MuiButton-label {
                    color: #0091ea;
                }
            `}</style>
            <h2>注意</h2>
            <ul>
                <li>得票率が指定した範囲に収まらない場合、高低とも黒色になることに注意してください。</li>
                <li>党名は2019年7月当時のものです。当時の「NHKから国民を守る党」は、現在「嵐の党」に改名しています。</li>
                <li>当時の「立憲民主党」と「国民民主党」は、2020年9月に合流しています (現在の立憲民主党)。</li>
                <li>ご意見・ご感想・ご要望などあればhideo54へ。(Twitter: <IconLink RightIcon={Open} href='https://twitter.com/hideo54'>@hideo54</IconLink>)</li>
            </ul>
            <h2>クレジット</h2>
            <p>
                開票データは、東京都選挙管理委員会事務局の「<IconLink RightIcon={Open} href='https://www.senkyo.metro.tokyo.lg.jp/election/sanngiin-all/sanngiin-sokuhou2019/'>参議院議員選挙（令和元年7月21日執行） 投開票結果</IconLink>」ページからダウンロードできる「政党等別得票総数開票区別一覧」データから、「得票総数」の値を用いています。つまり、「政党等の得票総数」と「名簿登載者の得票総数」を足した値です。
            </p>
            <p>
                東京都区画地図は、Lincun, ニンジンシチュー, LT sfm による <IconLink
                    LeftIcon={WikipediaW}
                    RightIcon={Open}
                    href='https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB:%E5%8C%85%E6%8B%AC%E8%87%AA%E6%B2%BB%E4%BD%93%E5%8C%BA%E7%94%BB%E5%9B%B3_13000.svg'
                >
                    ファイル:包括自治体区画図 13000.svg
                </IconLink> (GNU Free Documentation License) に、リンクの削除、不要なデータを取り除く軽量化、IDの付与などの改変を独自に加えたものです。このファイルは<Link href='/images/Map_of_Tokyo_Ja.svg'>こちら</Link>にて、同じ GNU Free Documentation License のもと公開しています。
            </p>
        </Layout>
    );
};

export default App;
