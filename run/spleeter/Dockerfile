# pkgutil.ImpImporter fails in Python 3.12
# Installation of numpy 1.17.x fails in Python 3.10 or later with PyUnicode_FromUnicode error
# ...and also fails in Python 3.8 or later with __Pyx_PyCode_New error
FROM python:3.7

RUN apt-get update
RUN apt-get install -y ffmpeg libsndfile1-dev

# numpy.long is removed in numpy >= 1.24
# A bug with Cython 3 is in 1.18.x and 1.19.x.
RUN pip install numpy==1.17

RUN pip install spleeter

WORKDIR /app
