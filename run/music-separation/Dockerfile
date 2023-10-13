FROM python:3.10

RUN apt-get update
RUN apt-get upgrade
RUN pip install poetry
RUN poetry config virtualenvs.create false

WORKDIR /app

COPY . .

RUN poetry install

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 server:app
