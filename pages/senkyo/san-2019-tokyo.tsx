import React, { useState } from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import styled from 'styled-components';
import { WikipediaW } from '@styled-icons/fa-brands';
import { Open } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';
import MapOfTokyo from '../../public/Map_of_Tokyo_Ja.svg';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const ControlsDiv = styled.div`
    margin-bottom: 2em;
    text-align: center;
`;

const App = () => {
    const mainViewbox = '28 12 747 375';
    const tokubetsukuViewbox = '501 89 275 279';
    const [ showTokubetsukuOnly, setShowTokubetsukuOnly ] = useState(false);
    const toggleShow = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowTokubetsukuOnly(event.target.checked);
    };
    const tokubetsukuCheckbox = <Checkbox checked={showTokubetsukuOnly} onChange={toggleShow} />;
    return (
        <Layout
            title='2019年参院選における東京都の地区別投票傾向分析 | hideo54 Lab'
            description='ひとくちに東京都と言っても、地区ごとにみると、その投票傾向は少しずつ違っています。2019年に行われた参院選の開票結果を使って、その傾向をヴィジュアライズしています。'
        >
            <H1>2019年参院選における東京都の地区別投票傾向分析</H1>
            <ControlsDiv>
                <FormControlLabel control={tokubetsukuCheckbox} label='特別区のみを表示' />
            </ControlsDiv>
            <MapOfTokyo viewBox={showTokubetsukuOnly ? tokubetsukuViewbox : mainViewbox} />
            <style>{`
                #Map_of_Tokyo_Ja_svg__main {
                    fill: white;
                    stroke: #333333;
                    stroke-width: 0.5;
                }
                #Map_of_Tokyo_Ja_svg__toshobu, #Map_of_Tokyo_Ja_svg__lakes, #Map_of_Tokyo_Ja_svg__outside {
                    display: none;
                }
            `}</style>
            <h2>Credit</h2>
            <p>
                東京都全体の地図: Lincun, ニンジンシチュー, LT sfm による <IconLink
                    LeftIcon={WikipediaW}
                    RightIcon={Open}
                    href='https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB:%E5%8C%85%E6%8B%AC%E8%87%AA%E6%B2%BB%E4%BD%93%E5%8C%BA%E7%94%BB%E5%9B%B3_13000.svg'
                >
                    ファイル:包括自治体区画図 13000.svg
                </IconLink> (GNU Free Documentation License)
            </p>
        </Layout>
    );
};

export default App;
