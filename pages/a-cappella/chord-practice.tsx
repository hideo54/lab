import { useEffect, useState } from 'react';
import { AddCircle, RemoveCircle } from '@styled-icons/ionicons-solid';
import Layout from '../../components/Layout';
import Piano from '../../components/Piano';
import { codeToHz, playSound } from '../../lib/music';
import { ArrowDown } from '@styled-icons/ionicons-outline';

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();
    const [tone, setTone] = useState<string>('C');
    const [octave, setOctave] = useState<number>(3);
    const [counter, setCounter] = useState<number>(0); // Just for re-rendering

    useEffect(() => {
        setAudioContext(new AudioContext());
        return () => setAudioContext(undefined);
    }, []);

    useEffect(() => {
        if (audioContext === undefined) return;
        playSound({
            audioContext,
            hz: codeToHz(tone + octave.toString()),
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
            <div className='mx-auto mt-8 max-w-lg'>
                <Piano
                    width='90%'
                    height='200px'
                    onClick={(tone: string) => {
                        setTone(tone);
                        setCounter(counter + 1);
                    }}
                />
            </div>
            <div className='text-center my-8'>
                <ArrowDown size='3em' />
            </div>
        </Layout>
    );
};

export default App;
