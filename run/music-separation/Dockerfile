FROM python:3.9

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y ffmpeg
RUN pip install poetry
RUN poetry config virtualenvs.create false

WORKDIR /app

COPY . .

RUN poetry install

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
