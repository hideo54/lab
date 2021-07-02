import { WikipediaW } from '@styled-icons/fa-brands';
import { Open } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { IconLink } from '../../components/atoms';
import MapOfTokyo from '../../public/Map_of_Tokyo_Ja.svg';

const App = () => {
    return (
        <Layout
            title='2019年参院選における東京都の地区別投票傾向分析 | hideo54 Lab'
            description='ひとくちに東京都と言っても、地区ごとにみると、その投票傾向は少しずつ違っています。2019年に行われた参院選の開票結果を使って、その傾向をヴィジュアライズしています。'
        >
            <h1>2019年参院選における東京都の地区別投票傾向分析</h1>
            <MapOfTokyo />
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
