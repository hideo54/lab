import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import uTokyoLibNewspapersJson from '../../public/data/u-tokyo-lib-newspapers.json';
import { IconAnchor, IconSpan } from '@hideo54/reactor';
import { InformationCircle, Location, Newspaper, Open } from '@styled-icons/ionicons-outline';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';

const H1 = styled.h1`
    font-family: 'Noto Sans JP', sans-serif;
`;

const ControlsDiv = styled.div`
    margin: 1rem 0;
    div {
        display: flex;
        justify-content: center;
    }
    .MuiCheckbox-root svg[data-testid="CheckBoxOutlineBlankIcon"] path {
        @media (prefers-color-scheme: dark) {
            fill: #cccccc;
        }
    }
`;

const SearchField = styled(TextField)`
    width: 300px;
    @media (prefers-color-scheme: dark) {
        label {
            color: #cccccc;
        }
        input {
            color: white;
        }
        .MuiOutlinedInput-notchedOutline {
            border-color: #888888;
        }
        .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline {
            border-color: #888888;
        }
    }
`;

const CardsSection = styled.section`
    display: flex;
    flex-wrap: wrap;
`;

const CardDiv = styled.div`
    min-width: 300px;
    margin: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px #CCCCCC;
    @media (prefers-color-scheme: dark) {
        box-shadow: 0 0 10px #444444;
    }

    .emoji {
        font-size: 1.2rem;
    }
    h2 {
        margin-top: 0;
    }
    span.campus {
        font-weight: normal;
        font-size: 1rem;
        margin-right: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        &.本郷 {
            color: white;
            background-color: #ff8f00;
        }
        &.弥生 {
            color: white;
            background-color: #4e342e;
        }
        &.駒場 {
            color: white;
            background-color: #0d47a1;
        }
        &.柏 {
            color: white;
            background-color: #2e7d32;
        }
        &.白金台 {
            color: black;
            background-color: #bdbdbd;
        }
    }
`;

const returnCountryEmoji = (name: string) => {
    if (name === 'Japan') return '🇯🇵';
    if (name === 'Korea') return '🇰🇷';
    if (name === 'China') return '🇨🇳';
    if (name === 'Taiwan') return '🇹🇼';
    if (name === 'France') return '🇫🇷';
    if (name === 'Germany') return '🇩🇪';
    if (name === 'Myanma') return '🇲🇲';
    if (name === 'UK') return '🇬🇧';
    if (name === 'USA') return '🇺🇸';
};

const locations = [
    {
        name: '総合図書館',
        pageUrl: 'https://www.lib.u-tokyo.ac.jp/ja/library/general',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_00_07_j.html',
        campus: '本郷',
    },
    {
        name: '法学部研究室図書室',
        pageUrl: 'https://www.lib.j.u-tokyo.ac.jp/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_01_03_j.html',
        campus: '本郷',
    },
    {
        name: '医学図書館',
        pageUrl: 'https://www.lib.m.u-tokyo.ac.jp/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_02_01_j.html',
        campus: '本郷',
    },
    {
        name: '工学・情報理工学図書館 工1号館図書室A(社会基盤学)',
        pageUrl: 'https://library.t.u-tokyo.ac.jp/eng1a.php',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_04_02_j.html',
        campus: '本郷',
    },
    {
        name: '工学・情報理工学図書館 工2号館図書室',
        pageUrl: 'https://library.t.u-tokyo.ac.jp/eng2.php',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_04_03_j.html',
        campus: '本郷',
    },
    {
        name: '工学・情報理工学図書館 工3号館図書室(システム創成学、技術経営戦略学)',
        pageUrl: 'https://library.t.u-tokyo.ac.jp/eng3.php',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_04_04_j.html',
        campus: '本郷',
    },
    {
        name: '工学・情報理工学図書館　工5号館図書室（化学・生命系）',
        pageUrl: 'https://library.t.u-tokyo.ac.jp/eng5.php',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_04_04_j.html',
        campus: '本郷',
    },
    {
        name: '工学・情報理工学図書館　工7号館図書室（航空宇宙工学）',
        pageUrl: 'https://library.t.u-tokyo.ac.jp/eng7.php',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_04_08_j.html',
        campus: '本郷',
    },
    {
        name: '工学・情報理工学図書館 工14号館図書室（都市工学）',
        pageUrl: 'https://library.t.u-tokyo.ac.jp/eng14.php',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_04_15_j.html',
        campus: '本郷',
    },
    {
        name: '大学院人文社会系研究科・文学部図書室',
        pageUrl: 'https://www.l.u-tokyo.ac.jp/lib/index.html',
        mapUrl: 'https://www.l.u-tokyo.ac.jp/lib/access.html',
        campus: '本郷',
    },
    {
        name: '大学院人文社会系研究科インド哲学仏教学研究室',
        pageUrl: 'http://www.l.u-tokyo.ac.jp/intetsu/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_01_02_j.html',
        campus: '本郷',
    },
    {
        name: '大学院人文社会系研究科・文学部宗教学・宗教史学研究室',
        pageUrl: 'http://www.l.u-tokyo.ac.jp/religion/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_01_02_j.html',
        campus: '本郷',
    },
    {
        name: '大学院人文社会系研究科・文学部英語英米文学研究室',
        pageUrl: 'http://www.l.u-tokyo.ac.jp/english/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_05_03_j.html',
        campus: '本郷',
    },
    {
        name: '大学院人文社会系研究科・文学部ドイツ語ドイツ文学研究室',
        pageUrl: 'http://www.l.u-tokyo.ac.jp/dokubun/index.html',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_05_03_j.html',
        campus: '本郷',
    },
    {
        name: '大学院人文社会系研究科・文学部フランス語フランス文学研究室',
        pageUrl: 'http://www.l.u-tokyo.ac.jp/futsubun/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_05_03_j.html',
        campus: '本郷',
    },
    {
        name: '理学図書館',
        pageUrl: 'https://www.lib.u-tokyo.ac.jp/ja/library/science',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_06_01_j.html',
        campus: '本郷',
    },
    {
        name: '経済学図書館',
        pageUrl: 'http://www.lib.e.u-tokyo.ac.jp/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_08_02_j.html',
        campus: '本郷',
    },
    {
        name: '教育学部図書室',
        pageUrl: 'https://ikuto.p.u-tokyo.ac.jp/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_09_01_j.html',
        campus: '本郷',
    },
    {
        name: '薬学図書館',
        pageUrl: 'https://www.lib.f.u-tokyo.ac.jp/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_10_03_j.html',
        campus: '本郷',
    },
    {
        name: '情報学環・学際情報学府図書室',
        pageUrl: 'https://www.lib.iii.u-tokyo.ac.jp/index.html',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_14_01_j.html',
        campus: '本郷',
    },
    {
        name: '情報学環附属社会情報研究資料センター',
        pageUrl: 'https://www.center.iii.u-tokyo.ac.jp/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_14_01_j.html',
        campus: '本郷',
    },
    {
        name: '東洋文化研究所図書室',
        pageUrl: 'https://www.ioc.u-tokyo.ac.jp/~library/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_12_02_j.html',
        campus: '本郷',
    },
    {
        name: '農学生命科学図書館',
        pageUrl: 'https://www.lib.u-tokyo.ac.jp/ja/library/contents/guide/agricultural_lifesciences',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_07_07_j.html',
        campus: '弥生',
    },
    {
        name: '地震研究所図書室',
        pageUrl: 'https://www.eri.u-tokyo.ac.jp/tosho/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam01_12_06_j.html',
        campus: '弥生',
    },
    {
        name: '駒場図書館',
        pageUrl: 'https://www.lib.u-tokyo.ac.jp/ja/library/komaba',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam02_01_25_j.html',
        campus: '駒場',
    },
    {
        name: '大学院総合文化研究科附属アメリカ大平洋地域研究センター',
        pageUrl: 'http://www.cpas.c.u-tokyo.ac.jp/lib/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam02_01_13_j.html',
        campus: '駒場',
    },
    {
        name: '生産技術研究所図書室',
        pageUrl: 'http://www.iis.u-tokyo.ac.jp/~tosho/index.html',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam02_04_14_j.html',
        campus: '駒場',
    },
    {
        name: '先端科学技術研究センタ－図書室',
        pageUrl: 'https://www.rcast.u-tokyo.ac.jp/ja/library_index.html',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam02_03_03_j.html',
        campus: '駒場',
    },
    {
        name: '柏図書館',
        pageUrl: 'https://www.lib.u-tokyo.ac.jp/ja/library/kashiwa',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam03_04_04_j.html',
        campus: '柏',
    },
    {
        name: '宇宙線研究所図書室',
        pageUrl: 'https://www.icrr.u-tokyo.ac.jp/lib/lib_hp.html',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam03_02_01_j.html',
        campus: '柏',
    },
    {
        name: '物性研究所図書室',
        pageUrl: 'https://www.issp.u-tokyo.ac.jp/labs/tosyo/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam03_03_04_j.html',
        campus: '柏',
    },
    {
        name: '医科学研究所図書室',
        pageUrl: 'https://www.ims.u-tokyo.ac.jp/library/',
        mapUrl: 'https://www.u-tokyo.ac.jp/campusmap/cam04_01_08_j.html',
        campus: '白金台',
    },
];

const App = () => {
    const [searchWord, setSearchWord] = useState('');
    const allCampuses = [
        '本郷',
        '弥生',
        '駒場',
        '柏',
        '白金台',
    ];
    const [campuses, setCampuses] = useState(allCampuses);
    return (
        <Layout
            title='東京大学附属図書館 新聞所蔵リスト | hideo54 Lab'
            description='東京大学附属図書館が所蔵しているすべての新聞のリストを見やすくまとめています。急に地方紙や業界紙を読みたくなったときなどに便利です。'
        >
            <H1>東京大学附属図書館 新聞所蔵リスト</H1>
            <p>東京大学附属図書館が所蔵しているすべての新聞のリストを見やすくまとめています。急に地方紙や業界紙を読みたくなったときなどに便利です。</p>
            <ControlsDiv>
                <div>
                    <SearchField
                        label='新聞名'
                        value={searchWord}
                        onChange={e => setSearchWord(e.target.value)}
                    />
                </div>
                <div>
                    {allCampuses.map(campus =>
                        <FormControlLabel
                            key={campus}
                            control={<Checkbox checked={campuses.includes(campus)} />}
                            label={campus}
                            onChange={e => (e as React.ChangeEvent<HTMLInputElement>).target.checked
                                ? setCampuses([
                                    ...campuses,
                                    campus,
                                ])
                                : setCampuses(campuses.filter(c => c !== campus))
                            }
                        />
                    )}
                </div>
            </ControlsDiv>
            <CardsSection>
                {uTokyoLibNewspapersJson
                    .filter(p => p.新聞名.toLocaleLowerCase().includes(
                        searchWord.toLocaleLowerCase())
                    )
                    .filter(p => campuses.includes(
                        locations.filter(l => l.name === p.部局名)[0].campus)
                    )
                    .map((paper, i) => {
                        const { campus, pageUrl, mapUrl } = locations.filter(l => l.name === paper.部局名)[0];
                        return (
                            <CardDiv key={i}>
                                <div>
                                    <span className='emoji'>{returnCountryEmoji(paper.発行国)}</span>
                                    {' '}
                                    {paper.発行国}
                                </div>
                                <h2>
                                    <IconSpan LeftIcon={Newspaper}>
                                        {paper.新聞名}
                                    </IconSpan>
                                </h2>
                                <h3>
                                    <span className={`campus ${campus}`}>{campus}</span>
                                    {paper.部局名}
                                </h3>
                                <p>
                                    <IconAnchor
                                        href={pageUrl}
                                        LeftIcon={InformationCircle}
                                    >
                                        Webサイト
                                    </IconAnchor>
                                    <IconAnchor
                                        href={mapUrl}
                                        LeftIcon={Location}
                                    >
                                        キャンパスマップ
                                    </IconAnchor>
                                </p>
                                <p>原紙保存期間: {paper.原紙保存期間}</p>
                                {paper.縮刷版保存期間 !== '-' && (
                                    <p>縮刷版保存期間: {paper.縮刷版保存期間}</p>
                                )}
                                <p>
                                    <small>{paper.備考}</small>
                                </p>
                            </CardDiv>
                        );
                    })
                }
            </CardsSection>
            <h2>出典</h2>
            <p>
                <IconAnchor href='https://www.lib.u-tokyo.ac.jp/ja/library/contents/newspaper' RightIcon={Open}>
                東京大学附属図書館 新聞所蔵リスト | 東京大学附属図書館
                </IconAnchor>
                {' '}
                (2022年6月10日更新版を使用)
            </p>
        </Layout>
    );
};

export default App;
