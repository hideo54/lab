import { useState } from 'react';
import { Open } from '@styled-icons/ionicons-outline';
import { IconAnchor } from '@hideo54/reactor';
import Layout from '../../components/Layout';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [youTubeUrl, setYouTubeUrl] = useState('');
    const [resultUrls, setResultUrls] = useState<{[key: string]: string}>();

    return (
        <Layout>
            <h1>
                Music Separation
            </h1>
            <p>
                Demucs Music Source Separation by Meta Research.
            </p>
            <section>
                <div className='form-control w-full'>
                    <label className='label'>
                        <span className='label-text'>Input the target YouTube URL to analyze.</span>
                    </label>
                    <input
                        type='text'
                        placeholder='YouTube URL'
                        onChange={e => setYouTubeUrl(e.target.value)}
                        disabled={isLoading}
                        className='input input-bordered w-full'
                    />
                    <label className='label'>
                        <span className='label-text-alt'>Use the official video only.</span>
                    </label>
                </div>
                <button
                    className='btn btn-primary'
                    disabled={isLoading}
                    onClick={async () => {
                        setIsLoading(true);
                        await fetch('http://localhost:8080', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                url: youTubeUrl,
                            }),
                        }).then(res => res.json()).then(data => {
                            if (!data.ok) throw new Error('Something is not okay');
                            setResultUrls(data.resultUrls);
                        });
                        setIsLoading(false);
                    }}
                >
                    Separate
                </button>
                {isLoading && (
                    <progress className='progress' />
                )}
                {resultUrls && Object.entries(resultUrls).map(([stem, url]) => (
                    <div key={url}>
                        <div>{stem}</div>
                        <audio src={url} controls />
                    </div>
                ))}
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
                        <IconAnchor href='https://github.com/facebookresearch/demucs' RightIcon={Open}>
                            facebookresearch/demucs | GitHub
                        </IconAnchor>
                    </li>
                    <li>
                        Simon Rouard, Francisco Massa, Alexandre Défossez.
                        {' '}
                        <strong>
                            Hybrid Transformers for Music Source Separation.
                        </strong>
                        {' '}
                        Journal of Open Source Software. (2020)
                        {' '}
                        <IconAnchor href='https://doi.org/10.48550/arXiv.2211.08553' RightIcon={Open}>
                            DOI
                        </IconAnchor>
                    </li>
                </ul>
            </section>
        </Layout>
    );
};

export default App;
