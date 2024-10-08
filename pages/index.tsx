import { ChevronForward, Open } from '@styled-icons/ionicons-outline';
import { Flask } from '@styled-icons/ionicons-solid';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import Layout from '../components/Layout';
import { Github } from '@styled-icons/fa-brands';

const Card: React.FC<{
    href: string;
    title: string;
    children: React.ReactNode;
}> = ({ href, title, children }) => (
    <article className='shadow rounded-3xl m-8 p-4 border-2 dark:border-solid dark:border-white'>
        <h2 className='mt-2 font-bold font-noto'>
            <IconNextLink RightIcon={ChevronForward} href={href}>
                {title}
            </IconNextLink>
        </h2>
        <p>{children}</p>
    </article>
);

const App = () => {
    return (
        <Layout header={<></>}>
            <section className='text-center mb-10'>
                <div className='p-4 flex justify-center items-center'>
                    <Flask size='54px' className='fill-base-content' />
                    <span className='text-4xl font-noto m-4'>hideo54 Lab</span>
                </div>
                <div>単独でリリースするほどでもない小さな制作物を公開します。</div>
                <div className='my-4'>
                    <IconAnchor
                        href='https://github.com/hideo54/lab'
                        LeftIcon={Github}
                        RightIcon={Open}
                    >
                        GitHub Repository
                    </IconAnchor>
                </div>
            </section>
            <section>
                <Card
                    href='/music/musescore-inspector'
                    title='MuseScore Inspector (beta)'
                >
                    MuseScore 楽譜ファイルを読み取り、詳細を表示します。
                </Card>
                <Card
                    href='/music/chord-practice'
                    title='和音練習くん'
                >
                    基準音を選ぶと、その音と、3度・5度上の音を再生できます。
                </Card>
                <Card
                    href='/u-tokyo/party-approval-rate'
                    title='東京大学新入生の政党支持'
                >
                    東京大学新聞社 (東大新聞) が毎年新入生に対して行っている支持政党の調査の結果を経時的にまとめています。
                </Card>
                <Card
                    href='/u-tokyo/newspapers'
                    title='東京大学附属図書館 新聞所蔵リスト'
                >
                    東京大学附属図書館が所蔵しているすべての新聞のリストを見やすくまとめています。急に地方紙や業界紙を読みたくなったときなどに便利です。
                </Card>
                <Card
                    href='/senkyo/adams-simulator'
                    title='アダムズ方式シミュレータ'
                >
                    「一票の格差」是正のための議員定数配分で使われる「アダムス方式」。衆議院選挙の小選挙区制におけるその配分のされかたを確認できるシミュレータです。
                </Card>
                <Card
                    href='/senkyo/san-2019-tokyo'
                    title='2019年参院選における東京都の地区別投票傾向'
                >
                    ひとくちに東京都と言っても、地区ごとにみると、その投票傾向は少しずつ違っています。2019年に行われた参院選の開票結果を使って、その傾向をヴィジュアライズしています。
                </Card>
            </section>
        </Layout>
    );
};

export default App;
