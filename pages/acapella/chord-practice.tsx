import { useEffect, useState } from 'react';
import { AddCircle, Pause, Play, RemoveCircle } from '@styled-icons/ionicons-solid';
import { ArrowDown } from '@styled-icons/ionicons-outline';
import Layout from '../../components/Layout';
import Piano from '../../components/Piano';
import { playSound, toneToHz, transpose } from '../../lib/music';
import { sleep } from '../../lib/utils';

const ToneButton: React.FC<{
    audioContext: AudioContext;
    tone: string;
    second: number;
}> = ({ audioContext, tone, second }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!audioContext || !second) return;
        if (!isPlaying) return;
        const play = async () => {
            playSound({
                audioContext,
                hz: toneToHz(tone),
                second,
            });
            await sleep(second);
            setIsPlaying(false);
        };
        play();
    }, [audioContext, tone, second, isPlaying]);

    return (
        <div
            className={[
                'text-center m-4 p-4 border-2 border-solid border-gray-700 rounded',
                isPlaying
                    ? 'text-white bg-gray-700'
                    : '',
            ].join(' ')}
        >
            <div className='text-xl font-bold'>
                {tone}
            </div>
            <button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying
                    ? <Pause size='3em' />
                    : <Play size='3em' />
                }
            </button>
        </div>
    );
};

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();
    const [tone, setTone] = useState<string>('C');
    const [octave, setOctave] = useState<number>(3);
    const [counter, setCounter] = useState<number>(0); // Just for re-rendering

    const second = 2;

    useEffect(() => {
        setAudioContext(new AudioContext());
        return () => setAudioContext(undefined);
    }, []);

    useEffect(() => {
        if (audioContext === undefined) return;
        if (counter === 0) return; // Avoid playing on first render
        playSound({
            audioContext,
            hz: toneToHz(tone + octave.toString()),
            second: 1.5,
        });
    }, [audioContext, tone, octave, counter]);

    if (audioContext === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <Layout>
            <h1>
                和音練習くん
            </h1>
            <h2 className='text-center'>
                基本の音を選択しよう!
            </h2>
            <div className='flex justify-center items-center'>
                <RemoveCircle
                    size='3em'
                    opacity={octave > 2 ? 1 : 0}
                    className='mx-8 cursor-pointer'
                    onClick={() => {
                        if (octave > 2) {
                            setOctave(octave - 1);
                        }
                    }}
                />
                <div className='text-5xl text-center font-noto'>
                    {tone}{octave}
                </div>
                <AddCircle
                    size='3em'
                    opacity={octave < 5 ? 1 : 0}
                    className='mx-8 cursor-pointer'
                    onClick={() => {
                        if (octave < 5) {
                            setOctave(octave + 1);
                        }
                    }}
                />
            </div>
            <div className='mx-auto mt-8 max-w-lg h-48'>
                <Piano
                    onClick={(tone: string) => {
                        setTone(tone);
                        setCounter(counter + 1);
                    }}
                />
            </div>
            <div className='text-center my-8'>
                <ArrowDown size='3em' />
            </div>
            <div className='flex justify-center'>
                <ToneButton
                    audioContext={audioContext}
                    tone={`${tone}${octave}`}
                    second={second}
                />
                <ToneButton
                    audioContext={audioContext}
                    tone={transpose(tone, octave, 4).join('')}
                    second={second}
                />
                <ToneButton
                    audioContext={audioContext}
                    tone={transpose(tone, octave, 7).join('')}
                    second={second}
                />
            </div>
        </Layout>
    );
};

export default App;
