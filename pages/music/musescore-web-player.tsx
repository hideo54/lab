import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import { PauseCircle, PlayCircle } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import { playSound } from '../../lib/music';
import { durationTypeToSec } from '../../lib/MuseScore';

const sleep = async (sec: number) => new Promise(resolve =>
    setTimeout(resolve, sec * 1000)
);

const pitchNumberToHz = (pitch: number) => 440 * Math.pow(2, (pitch - 69) / 12);

const notUndefined = <T, >(item: T | undefined): item is T => item !== undefined;

const pick = <T extends Record<string, any>>(arr: T[], key: string) => arr.map(e => e[key]).filter(notUndefined);

const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);

const dotsToMultiple = (dots: number) => sum(
    Array.from({ length: dots + 1 }, (_, i) => (1 / 2) ** i)
);

const PlayButton: React.FC<{
    audioContext: AudioContext;
    staffs: any;
}> = ({ audioContext, staffs }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;
        let isCancelled = false;
        let bpm = 0;
        const play = async () => {
            const elements = pick(staffs, 'Measure').map(measure => pick(measure, 'voice')).flat().flat();
            for (const element of elements) {
                if (isCancelled) break;

                if (element.Tempo) {
                    bpm = pick(
                        pick(element.Tempo, 'tempo')[0], '#text'
                    )[0] * 60;
                }

                if (element.Chord) {
                    const durationType = pick(
                        pick(element.Chord, 'durationType')[0], '#text'
                    )[0];
                    const dotsElement = pick(element.Chord, 'dots');
                    const dots = dotsElement.length > 0 ? pick(dotsElement[0], '#text')[0] : 0;
                    const note = pick(element.Chord, 'Note')[0];
                    const pitch = pick(
                        pick(note, 'pitch')[0], '#text'
                    )[0];
                    const duration = durationTypeToSec(bpm, durationType) * dotsToMultiple(dots);

                    playSound({
                        audioContext,
                        hz: pitchNumberToHz(pitch),
                        second: duration,
                    });
                    await sleep(duration);
                }

                if (element.Rest) {
                    const durationType = pick(
                        pick(element.Rest, 'durationType')[0], '#text'
                    )[0];
                    if (durationType === 'measure') {
                        const durationText = pick(
                            pick(element.Rest, 'duration')[0], '#text'
                        )[0];
                        if (durationText === '4/4') {
                            const duration = durationTypeToSec(bpm, 'whole');
                            await sleep(duration);
                        } else if (durationText === '2/4') {
                            const duration = durationTypeToSec(bpm, 'half');
                            await sleep(duration);
                        } else {
                            console.error('Unknown durationText for "while" rest: ', durationText);
                            const duration = durationTypeToSec(bpm, 'whole');
                            await sleep(duration);
                        }
                    } else {
                        const duration = durationTypeToSec(bpm, durationType);
                        await sleep(duration);
                    }
                }
            }
            setIsPlaying(false);
        };
        play();
        return () => {
            isCancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    return (
        <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying
                ? <PauseCircle size='3em' />
                : <PlayCircle size='3em' />
            }
        </button>
    );
};

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scoreData, setScoreData] = useState<any>(null);

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
                    preserveOrder: true,
                });
                const data = pick(
                    pick(parser.parse(mscxXmlStr), 'museScore')[0], 'Score'
                )[0];
                setScoreData(data);
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
                <table className='w-auto mx-auto'>
                    <tbody>
                        {pick(scoreData, 'Part').map(part =>
                            pick(
                                pick(
                                    pick(part, 'Instrument')[0], 'longName'
                                )[0],
                                '#text'
                            )[0]
                        ).map((partName, i) => (
                            <tr key={i} className='px-4'>
                                <td className='text-2xl font-bold mr-4'>
                                    {partName}
                                </td>
                                <td>
                                    <span className='align-[4px]'>
                                        <PlayButton
                                            audioContext={audioContext}
                                            staffs={pick(scoreData, 'Staff')[i]}
                                        />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default App;
