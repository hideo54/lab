import os

from flask import Flask, request
from flask_cors import CORS
from yt_dlp import YoutubeDL
import demucs.separate
from google.cloud import storage

bucket_url = 'https://img.hideo54.com'
bucket_name = 'img.hideo54.com'
model = 'htdemucs'
stems = ['vocals', 'bass', 'drums', 'other']

app = Flask(__name__)
CORS(app)

storage_client = storage.Client()
bucket = storage_client.bucket(bucket_name)

@app.route('/', methods=['POST'])
def main():
    url = request.json.get('url')

    yt_dlp_options = {
        'format': 'bestaudio',
        'outtmpl': 'tmp/original/%(extractor_key)s_%(id)s.mp3',
    }
    with YoutubeDL(yt_dlp_options) as ydl:
        yt_dlp_result = ydl.extract_info(url, download=True)
        original_mp3_filename = yt_dlp_result['requested_downloads'][0]['filename']

    demucs.separate.main([
        '-o', 'tmp',
        '-n', model,
        '--filename', '{track}_{stem}.{ext}',
        '--jobs', 0,
        '--mp3',
        original_mp3_filename,
    ])

    result_urls = dict()

    for stem in stems:
        source_filename = f'tmp/{model}/{stem}'
        dest_filename = 'music-separation/' + original_mp3_filename.replace('.mp3', f'_{model}_stem.mp3')
        blob = bucket.blob(dest_filename)
        upload_result = blob.upload_from_filename(source_filename)
        result_urls[stem] = f'{bucket_url}/music-separation/{dest_filename}'

    return {
        'ok': True,
        'result': result_urls,
    }

if __name__ == '__main__':
    app.run(
        port=int(os.environ.get('PORT', 8080)),
        threaded=True,
    )
