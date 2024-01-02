import { useCallback, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import Layout from '../../components/Layout';

type AudioWorkletMessage = {
    pitch: {
        pitch: number;
        pitchConfidence: number;
    };
    rms: {
        rms: number;
    };
}

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();
    const [currentPitch, setCurrentPitch] = useState<number | undefined>();
    const [currentDb, setCurrentDb] = useState<number | undefined>();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleMessage = useCallback(
        throttle(
            (event: MessageEvent<AudioWorkletMessage>) => {
                const { pitch, rms } = event.data;
                const db = 20 * Math.log10(rms.rms);
                setCurrentDb(db);
                if (pitch.pitchConfidence > 0.5) {
                    setCurrentPitch(pitch.pitch);
                } else {
                    setCurrentPitch(undefined);
                }
            },
            200
        ),
        []
    );

    useEffect(() => {
        if (audioContext) return;
        (async () => {
            const audioContext = new AudioContext();
            await audioContext.audioWorklet.addModule('/lib/essentia-worklet-processor.js');
            const audioWorkletNode = new AudioWorkletNode(audioContext, 'essentia-worklet-processor');

            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(audioStream);
            mediaStreamAudioSourceNode.connect(audioWorkletNode);

            audioWorkletNode.port.onmessage = handleMessage;

            setAudioContext(audioContext);
        })();
    }, [audioContext, handleMessage]);

    return (
        <Layout>
            <h1>
                Pitch Test
            </h1>
            <p className='text-center'>
                <span className='text-6xl font-mono font-black mr-2 whitespace-pre'>
                    {currentPitch?.toFixed() || '---'}
                </span>
                <span>
                    Hz
                </span>
            </p>
            <p className='text-center'>
                <span className='text-3xl font-mono font-black mr-2'>
                    {currentDb?.toFixed() || '--'}
                </span>
                <span>
                    dB
                </span>
            </p>
        </Layout>
    );
};

export default App;
