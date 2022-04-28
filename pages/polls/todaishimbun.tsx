import React from 'react';
import styled from 'styled-components';
import { Open } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import Layout from '../../components/Layout';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const App = () => {
    return (
        <Layout
            title='東大新入生の政党支持 | hideo54 Lab'
            description='東京大学新聞社 (東大新聞) が毎年新入生に対して行っている支持政党の調査の結果を経時的にまとめています。'
        >
            <H1>東大新入生の政党支持</H1>
            <h2>ソース</h2>
            <ul>
                <li>2016年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/survey20160420/'>東大新入生、自民党支持は3割 民進党は4% | 東大新聞オンライン</IconAnchor></li>
                <li>2017年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/survey20170422/'>東大新入生アンケート2017② 支持政党は自民36%、民進3.4% 無支持は4%減 | 東大新聞オンライン</IconAnchor></li>
                <li>2018年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/survey20180428/'>【新入生アンケート2018 ④社会問題】憲法に自衛隊明記「賛成」52% | 東大新聞オンライン</IconAnchor></li>
                <li>2019年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/questionnaire20190425/'>新入生アンケート2019分析① 32.5%が「学生の男女比問題なし」 自民党支持率は低下 | 東大新聞オンライン</IconAnchor></li>
                <li>2020年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/enquate2020_4_20200504/'>新入生アンケート2020分析④ 社会問題編 オリ委員による「東大女子お断り」サークルの新歓制限「適切」78% | 東大新聞オンライン</IconAnchor></li>
                <li>2021年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/questionnaire0422/'>【新入生アンケート2021】77%が対面授業を希望 今年の新入生の傾向とは？ | 東大新聞オンライン</IconAnchor></li>
                <li>2022年: <IconAnchor RightIcon={Open} href='https://www.todaishimbun.org/questionnaire_20220426/'> 【新入生アンケート2022 ④社会問題】対面授業中心84％で最多 | 東大新聞オンライン</IconAnchor></li>
            </ul>
        </Layout>
    );
};

export default App;
