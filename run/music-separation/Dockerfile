FROM python:3.9

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ffmpeg

# For GPU requirements like libcufft, libcublas
RUN pip install torch
RUN pip install poetry
RUN poetry config virtualenvs.create false

WORKDIR /app

COPY . .

RUN poetry install

ENV GOOGLE_APPLICATION_CREDENTIALS key.json

CMD exec gunicorn --bind 0.0.0.0:8080 --workers 1 --threads 8 --timeout 0 server:app
