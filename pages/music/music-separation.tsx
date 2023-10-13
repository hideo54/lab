import { useState } from 'react';
import { Open } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import Layout from '../../components/Layout';

const App = () => {
    const [formAvailable, setFormAvailable] = useState(true);
    const [youTubeUrl, setYouTubeUrl] = useState('');

    return (
        <Layout>
            <h1>
                Spleeter
            </h1>
            <section>
                <div className='form-control w-full'>
                    <label className='label'>
                        <span className='label-text'>Input the target YouTube URL to analyze.</span>
                    </label>
                    <input
                        type='text'
                        placeholder='YouTube URL'
                        disabled={!formAvailable}
                        className='input input-bordered w-full'
                    />
                    <label className='label'>
                        <span className='label-text-alt'>Use the official video only.</span>
                    </label>
                </div>
                <button
                    disabled={!formAvailable}
                    onClick={() => {
                        fetch('/api/spleeter', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                url: youTubeUrl,
                            }),
                        }).then(res => res.json()).then(data => {
                            console.log(data);
                        });
                    }}
                >
                    Analyze
                </button>
            </section>
            <section>
                <h2>References</h2>
                <ul>
                    <li>
                        <IconAnchor href='https://github.com/yt-dlp/yt-dlp' RightIcon={Open}>
                            yt-dlp/yt-dlp | GitHub
                        </IconAnchor>
                    </li>
                    <li>
                        <IconAnchor href='https://github.com/deezer/spleeter' RightIcon={Open}>
                            deezer/spleeter | GitHub
                        </IconAnchor>
                    </li>
                    <li>
                        Romain Hennequin, Anis Khlif, Felix Voituret, Manuel Moussallam.
                        {' '}
                        <strong>
                            Spleeter: a fast and efficient music source separation tool with pre-trained models.
                        </strong>
                        {' '}
                        Journal of Open Source Software. (2020)
                        {' '}
                        <IconAnchor href='https://doi.org/10.21105/joss.02154' RightIcon={Open}>
                            DOI
                        </IconAnchor>
                    </li>
                </ul>
            </section>
        </Layout>
    );
};

export default App;
