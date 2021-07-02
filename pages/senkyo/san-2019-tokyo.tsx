import React, { useState } from 'react';
import Link from 'next/link';
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Slider, Checkbox } from '@material-ui/core';
import styled from 'styled-components';
import { WikipediaW } from '@styled-icons/fa-brands';
import { Open } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';
import votes from '../../public/data/san-2019-tokyo.json';
import MapOfTokyo from '../../public/images/Map_of_Tokyo_Ja.svg';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const ControlsDiv = styled.div`
    margin: 2em 0;
    padding: 0 1em;
    text-align: center;
`;

const mainViewbox = '28 12 747 375';
const tokubetsukuViewbox = '501 89 275 279';
const tokubetsukuIds = [
    'chiyoda', 'chuo', 'minato', 'shinjuku', 'bunkyo', 'taito', 'sumida', 'koto', 'shinagawa', 'meguro', 'ota', 'setagaya', 'shibuya', 'nakano', 'suginami', 'toshima', 'kita', 'arakawa', 'itabashi', 'nerima', 'adachi', 'katsushika', 'edogawa',
];
const tokaIds = [
    'hachioji', 'tachikawa', 'musashino', 'mitaka', 'ome', 'fuchu', 'akishima', 'chofu', 'machida', 'koganei', 'kodaira', 'hino', 'higashimurayama', 'kokubunji', 'kunitachi', 'fussa', 'komae', 'higashiyamato', 'kiyose', 'higashikurume', 'musashimurayama', 'tama', 'inagi', 'hamura', 'akiruno', 'nishitokyo', 'mizuho', 'hinode', 'hinohara', 'okutama', 'toshobu',
];
const parties = ['自由民主党', '立憲民主党', '公明党', '日本維新の会', '日本共産党', '国民民主党', 'れいわ新選組', '社会民主党', 'NHKから国民を守る党'] as const;

const generateColor = (v: number) => { // v: 0 - 1
    console.log(v);
    const clamp = (x: number) => {
        if (x < 0) return 0;
        if (x > 1) return 1;
        return x;
    };
    const t = v * 2 - 1 // v: (0, 1) -> t: (-1, 1)
    const r = (t: number) => clamp(1.5 - Math.abs(2 * t - 1));
    const g = (t: number) => clamp(1.5 - Math.abs(2 * t));
    const b = (t: number) => clamp(1.5 - Math.abs(2 * t + 1));
    return [r, g, b].map(f =>
        ('00' + Math.floor(f(t) * 255).toString(16)).slice(-2)
    ).join('');
    // https://stackoverflow.com/a/46628410/5864292
};

const App = () => {
    const [ party, setParty ] = useState<typeof parties[number]>('自由民主党');
    const [ range, setRange ] = useState([0, 65]);
    const [ showTokubetsukuOnly, setShowTokubetsukuOnly ] = useState(false);
    const handlePartyChange = (event: React.ChangeEvent<{ value: typeof parties[number] }>) => {
        setParty(event.target.value);
    };
    const handleRangeChange = (event: any, newValue: number[]) => {
        setRange(newValue);
    };
    const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowTokubetsukuOnly(event.target.checked);
    };
    const tokubetsukuCheckbox = <Checkbox checked={showTokubetsukuOnly} onChange={handleTargetChange} />;
    const targetIds = [...tokubetsukuIds, ...(showTokubetsukuOnly ? [] : tokaIds)];
    return (
        <Layout
            title='2019年参院選における東京都の地区別投票傾向分析 | hideo54 Lab'
            description='ひとくちに東京都と言っても、地区ごとにみると、その投票傾向は少しずつ違っています。2019年に行われた参院選の開票結果を使って、その傾向をヴィジュアライズしています。'
        >
            <H1>2019年参院選における東京都の区画別投票傾向分析</H1>
            <ControlsDiv>
                <FormControl variant='outlined'>
                    <InputLabel id='party'>政党</InputLabel>
                    <Select value={party} onChange={handlePartyChange} labelId='party' label='政党'>
                        {parties.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </FormControl>
                <Slider value={range} onChange={handleRangeChange} max={65} valueLabelDisplay='on' style={{ marginTop: '3em' }} />
                <FormControlLabel control={tokubetsukuCheckbox} label='特別区のみを表示' />
            </ControlsDiv>
            <MapOfTokyo viewBox={showTokubetsukuOnly ? tokubetsukuViewbox : mainViewbox} style={{
                maxHeight: '50vh',
            }} />
            <style>{`
                #Map_of_Tokyo_Ja_svg__main {
                    fill: white;
                    stroke: #333333;
                    stroke-width: 0.5;
                }
                ${showTokubetsukuOnly ? `#Map_of_Tokyo_Ja_svg__toka,` : ''} #Map_of_Tokyo_Ja_svg__toshobu, #Map_of_Tokyo_Ja_svg__lakes, #Map_of_Tokyo_Ja_svg__outside {
                    display: none;
                }
            `}</style>
            <style>{
                targetIds.map(id => `
                    #Map_of_Tokyo_Ja_svg__${id} {
                        fill: #${generateColor((100 * votes[id][party] - range[0]) / (range[1] - range[0]))};
                    }
                `).join('')
            }</style>
            <h2>Credit</h2>
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
                </IconLink> (GNU Free Documentation License) に、リンクの削除、不要なデータを取り除く軽量化、IDの付与などの改変を独自に加えたものです。このファイルは<Link href='/images/Map_of_Tokyo_Ja.svg'>こちら</Link>にて、同じ GNU Free Documentation License のもと公開いたします。
            </p>
        </Layout>
    );
};

export default App;
