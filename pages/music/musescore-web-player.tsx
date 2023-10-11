import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import Layout from '../../components/Layout';
import { playSound } from '../../lib/music';
import type { MuseScore, Chord } from '../../lib/MuseScore';
import { PauseCircle, PlayCircle } from '@styled-icons/ionicons-outline';

const durationTypeToSec = (bpm: number, durationType: Chord['durationType']) => {
    const beatSecond = 4 * 60 / bpm;
    if (durationType === 'whole') return beatSecond;
    if (durationType === 'half') return beatSecond / 2;
    if (durationType === 'quarter') return beatSecond / 4;
    if (durationType === 'eighth') return beatSecond / 8;
    if (durationType === '16th') return beatSecond / 16;
    console.log(durationType);
    return 0;
};

const sleep = async (sec: number) => new Promise(resolve =>
    setTimeout(resolve, sec * 1000)
);

const pluralize = <T, >(value: T | T[]) => Array.isArray(value) ? value : [value];

const pitchNumberToHz = (pitch: number) => 440 * Math.pow(2, (pitch - 69) / 12);

const notUndefined = <T, >(item: T | undefined): item is T => item !== undefined;

const PlayButton: React.FC<{
    audioContext: AudioContext,
    scoreData: MuseScore,
    partIndex: number,
}> = ({ audioContext, scoreData, partIndex }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const tempos = scoreData.Score.Staff.map(staff =>
        staff.Measure.map(measure => measure.voice.Tempo)
    ).flat().filter(notUndefined);
    const bpm = tempos[0].tempo * 60;

    useEffect(() => {
        if (!isPlaying) return;
        let isCancelled = false;
        const play = async () => {
            for (const measure of scoreData.Score.Staff[partIndex].Measure) {
                if (isCancelled) break;
                if (measure.voice.Chord) {
                    const chords = pluralize(measure.voice.Chord);
                    for (const chord of chords) {
                        const notes = pluralize(chord.Note);
                        for (const note of notes) {
                            const duration = durationTypeToSec(bpm, chord.durationType);
                            playSound({
                                audioContext,
                                hz: pitchNumberToHz(note.pitch),
                                second: duration,
                            });
                            await sleep(duration);
                        }
                    }
                }
                if (measure.voice.Rest) {
                    const rests = pluralize(measure.voice.Rest);
                    for (const rest of rests) {
                        const duration = durationTypeToSec(
                            bpm,
                            rest.durationType === 'measure' ? 'whole' : rest.durationType
                        );
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
                        {scoreData.Score.Part.map(part => part.Instrument.longName).map((partName, i) =>
                            <tr key={partName} className='px-4'>
                                <td className='text-2xl font-bold mr-4'>
                                    {partName}
                                </td>
                                <td>
                                    <span className='align-[4px]'>
                                        <PlayButton
                                            audioContext={audioContext}
                                            scoreData={scoreData}
                                            partIndex={i}
                                        />
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </Layout>
    );
};

export default App;
