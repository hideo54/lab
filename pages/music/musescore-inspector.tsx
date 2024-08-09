import { useEffect, useState } from 'react';
import { PauseCircle, PlayCircle } from '@styled-icons/ionicons-outline';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Layout from '../../components/Layout';
import type { MuseScore } from '../../lib/MuseScore';
import { midiNumberToNoteName, pitchNumberToHz, playSound } from '../../lib/music';
import { notUndefined, sleep } from '../../lib/utils';
import { countBy, range } from 'lodash';

const getFirstPitch = (scoreData: MuseScore, partIndex: number) => {
    const chords = scoreData.Score.Staff[partIndex].Measure.map(measure => measure.voice.Chord).flat().filter(notUndefined);
    const notes = chords.map(chord => chord.Note).flat().filter(notUndefined);
    const firstPitch = notes[0].pitch;
    return firstPitch;
};

const PlayButton: React.FC<{
    audioContext: AudioContext;
    hz: number;
    second: number;
}> = ({ audioContext, hz, second }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!audioContext) return;
        if (!isPlaying) return;
        const play = async () => {
            playSound({
                audioContext,
                hz,
                second,
            });
            await sleep(second);
            setIsPlaying(false);
        };
        play();
    }, [audioContext, hz, second, isPlaying]);

    return (
        <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying
                ? <PauseCircle size='3em' />
                : <PlayCircle size='3em' />
            }
        </button>
    );
};

const PitchDistribution: React.FC<{
    audioContext: AudioContext;
    scoreData: MuseScore;
}> = ({ audioContext, scoreData }) => {
    const partNames = scoreData.Score.Part.map(part => part.Instrument.longName);
    const [selectedPartIndex, setSelectedPartIndex] = useState(0);
    const getPitches = (partIndex: number) => (
        scoreData.Score.Staff[partIndex].Measure
            .map(measure => measure.voice.Chord).flat().filter(notUndefined)
            .map(chord => chord.Note).flat().filter(notUndefined)
            .map(note => note.pitch)
    );
    const pitches = getPitches(selectedPartIndex);
    const minPitch = Math.min(...range(partNames.length).map(i => getPitches(i)).flat());
    const maxPitch = Math.max(...range(partNames.length).map(i => getPitches(i)).flat());
    const pitchCount = countBy(pitches);
    const maxPitchCount = Math.max(
        ...range(partNames.length).map(i =>
            Object.values(countBy(getPitches(i)))
        ).flat()
    );
    const filledPitchCountEntries = range(minPitch, maxPitch + 1).map(pitch => [
        pitch,
        pitchCount[pitch] || 0,
    ]);
    return (
        <section>
            <h2 className='mb-0'>音の高さの分布</h2>
            <div className='mb-4'>
                <small>
                    音の長さは考慮しておらず、純粋に音符の数のみをカウントしていることに注意。
                </small>
            </div>
            <div className='text-center'>
                <select
                    className='select select-bordered w-full max-w-xs'
                    onChange={e => setSelectedPartIndex(parseInt(e.target.value))}
                >
                    {partNames.map((partName, i) =>
                        <option key={partName} value={i}>{partName}</option>
                    )}
                </select>
                <ResponsiveContainer width='100%' height={500}>
                    <BarChart
                        width={600}
                        height={400}
                        data={filledPitchCountEntries.map(([pitch, count]) => ({
                            pitch,
                            pitchName: midiNumberToNoteName(pitch),
                            count,
                        }))}
                    >
                        <XAxis dataKey='pitchName' />
                        <YAxis
                            domain={[0, Math.floor(maxPitchCount * 1.1)]}
                            minTickGap={10}
                        />
                        <Bar
                            dataKey='count'
                            className='fill-primary cursor-pointer'
                            onClick={data => {
                                playSound({
                                    audioContext,
                                    hz: pitchNumberToHz(data.payload.pitch),
                                    second: 2,
                                });
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

const FirstPitch: React.FC<{
    audioContext: AudioContext;
    scoreData: MuseScore;
}> = ({ audioContext, scoreData }) => {
    const partNames = scoreData.Score.Part.map(part => part.Instrument.longName);
    return (
        <section>
            <h2>はじめの音</h2>
            <table className='w-auto mx-auto'>
                <tbody>
                    {partNames.map((partName, i) =>
                        <tr key={partName} className='px-4'>
                            <td className='text-2xl font-bold mr-4'>
                                {partName}
                            </td>
                            <td>
                                <span className='align-[4px]'>
                                    <PlayButton
                                        audioContext={audioContext}
                                        hz={pitchNumberToHz(getFirstPitch(scoreData, i))}
                                        second={2}
                                    />
                                </span>
                                <span className='text-xl'>
                                    {midiNumberToNoteName(getFirstPitch(scoreData, i))}
                                </span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scoreData, setScoreData] = useState<MuseScore | null>(null);

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
                const parser = new XMLParser();
                const data = parser.parse(mscxXmlStr).museScore as MuseScore;
                setScoreData(data);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    }, [audioContext, selectedFile]);

    return (
        <Layout>
            <h1>
                MuseScore Inspector
            </h1>
            <p>
                MuseScore 楽譜を読み取り、情報を表示します。
                <br />
                楽譜データは完全にローカルで処理され、アップロードは発生しません。
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
                <div>
                    <PitchDistribution audioContext={audioContext} scoreData={scoreData} />
                    <FirstPitch audioContext={audioContext} scoreData={scoreData} />
                </div>
            )}
        </Layout>
    );
};

export default App;
