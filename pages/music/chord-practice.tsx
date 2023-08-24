import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Piano from '../../components/Piano';
import { codeToHz, playSound } from '../../lib/music';

const App = () => {
    const [audioContext, setAudioContext] = useState<
        AudioContext | undefined
    >();

    useEffect(() => {
        setAudioContext(new AudioContext());
        return () => setAudioContext(undefined);
    }, []);

    return (
        <Layout>
            {audioContext ? (
                <div>
                    <Piano
                        onClick={(code: string) =>
                            playSound({
                                audioContext,
                                hz: codeToHz(code),
                                second: 1.5,
                            })
                        }
                    />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </Layout>
    );
};

export default App;
