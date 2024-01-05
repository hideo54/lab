import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import { PauseCircle, PlayCircle } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { playSound } from '../../lib/music';
import { parseMuseScoreScoreIntoPartCommands } from '../../lib/MuseScore';
import { pick } from '../../lib/utils';

const PlayButton: React.FC<{
    audioContext: AudioContext;
    score: any;
    selectedPartIndices: number[];
}> = ({ audioContext, score, selectedPartIndices }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const onClick = () => setIsPlaying(p => !p);
    useEffect(() => {
        if (!score) return;
        if (!isPlaying) return;
        const partCommands = parseMuseScoreScoreIntoPartCommands(score);
        for (const partCommand of partCommands) {
            // TODO
            // playSound({
            //     audioContext,
            //     hz: 440,
            //     second: 100,
            // });
        }
    }, [isPlaying]);
    return (
        <div className='cursor-pointer'>
            {isPlaying
                ? <PauseCircle size='8em' onClick={onClick} />
                : <PlayCircle size='8em' onClick={onClick} />
            }
        </div>
    );
};

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [scoreData, setScoreData] = useState<any>(null);
    const [selectedPartIndices, setSelectedPartIndices] = useState<number[]>([]);

    useEffect(() => {
        setAudioContext(new AudioContext());
        return () => setAudioContext(undefined);
    }, []);

    useEffect(() => {
        if (audioContext && selectedFile) {
            const reader = new FileReader();
            reader.onload = async e => {
                const buf = e.target?.result as ArrayBuffer;
                const zip = new JSZip();
                const result = await zip.loadAsync(buf);
                const mscxFile = Object.entries(result.files).filter(([k]) => k.endsWith('.mscx'))[0][1];
                const mscxXmlStr = await mscxFile.async('string');
                const parser = new XMLParser({
                    ignoreAttributes: false,
                    preserveOrder: true,
                });
                const data = pick(
                    pick(parser.parse(mscxXmlStr), 'museScore')[0], 'Score'
                )[0];
                setScoreData(data);
                setSelectedPartIndices(
                    Array(pick(data, 'Part').length).fill(0).map((_, i) => i)
                );
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    }, [audioContext, selectedFile]);

    return (
        <Layout>
            <h1>
                MuseScore Web Player
            </h1>
            <p>
                Working in progress with a lot of bugs.
            </p>
            <section className='my-4'>
                <div className='form-control'>
                    <label className='label'>
                        <span className='label-text'>
                            MuseScore ファイル (.mscz) を選択してください
                        </span>
                    </label>
                    <input
                        type='file'
                        accept='.mscz'
                        className='file-input file-input-bordered max-w-full'
                        onChange={e => {
                            if (e.target.files) {
                                setSelectedFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>
            </section>
            {audioContext && scoreData && (
                <section className='flex items-center'>
                    <table className='w-auto mx-4'>
                        <tbody>
                            {pick(scoreData, 'Part').map(part =>
                                pick(
                                    pick(
                                        pick(part, 'Instrument')[0], 'longName'
                                    )[0],
                                    '#text'
                                )[0]
                            ).map((partName, i) => (
                                <tr
                                    key={i}
                                    className='px-4 cursor-pointer'
                                    onClick={() => {
                                        if (selectedPartIndices.includes(i)) {
                                            setSelectedPartIndices(selectedPartIndices.filter(j => j !== i));
                                        } else {
                                            setSelectedPartIndices([...selectedPartIndices, i]);
                                        }
                                    }}
                                >
                                    <td>
                                        <span className='align-[-3px]'>
                                            <input
                                                type='checkbox'
                                                className={'checkbox'}
                                                checked={selectedPartIndices.includes(i)}
                                                onChange={() => {
                                                    // Inherited from parent
                                                }}
                                            />
                                        </span>
                                    </td>
                                    <td className='text-2xl font-bold select-none'>
                                        {partName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='mx-4'>
                        <PlayButton
                            audioContext={audioContext}
                            score={scoreData}
                            selectedPartIndices={selectedPartIndices}
                        />
                    </div>
                </section>
            )}
        </Layout>
    );
};

export default App;
