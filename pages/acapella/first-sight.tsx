import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import Layout from '../../components/Layout';
import type { MuseScore } from '../../MuseScore';

const App = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = async e => {
                const buf = e.target?.result as ArrayBuffer;
                const zip = new JSZip();
                const result = await zip.loadAsync(buf);
                const mscxFile = Object.entries(result.files).filter(([k]) => k.endsWith('.mscx'))[0][1];
                const mscxXmlStr = await mscxFile.async('string');
                const parser = new XMLParser();
                const data = parser.parse(mscxXmlStr).museScore as MuseScore;
                console.log(data);

                const parts = data.Score.Part.map(part => part.Instrument.longName);
                console.log(parts);
            };
            reader.readAsArrayBuffer(selectedFile);
        }
    }, [selectedFile]);

    return (
        <Layout>
            <h1>
                FirstSight
            </h1>
            <p>
                各パートの始めの音を再生します。
            </p>
            <section className='text-center'>
                <input type='file' accept='.mscz'
                    onChange={e => {
                        if (e.target.files) {
                            setSelectedFile(e.target.files[0]);
                        }
                    }}
                />
            </section>
        </Layout>
    );
};

export default App;
