# pkgutil.ImpImporter fails in Python 3.12
# Installation of numpy 1.17.x fails in Python 3.10 or later with PyUnicode_FromUnicode error
# ...and also fails in Python 3.8 or later with __Pyx_PyCode_New error
FROM python:3.7

RUN apt-get update
RUN apt-get install -y ffmpeg libsndfile1-dev

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
