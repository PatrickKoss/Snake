FROM python:3.8

WORKDIR /usr/src/SnakeBackend

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/usr/src/SnakeBackend
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

EXPOSE 8000
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000"]
