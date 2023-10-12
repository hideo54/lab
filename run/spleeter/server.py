import os

from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def main():
    url = request.json.get('url')
    print(url)

    # TODO: Exec yt-dlp

    # TODO: Exec spleeter

    # TODO: Upload to Cloud Storage

    # TODO: Return URL

    return {
        'ok': True,
    }

if __name__ == '__main__':
    app.run(
        port=int(os.environ.get('PORT', 8080)),
        threaded=True,
    )
