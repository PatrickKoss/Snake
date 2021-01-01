# build snake backend
FROM python:3.7

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r ./SnakeBackend/requirements.txt

ENV PYTHONPATH=/app/SnakeBackend
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Build frontend
FROM node:lts-alpine as build-stage
WORKDIR /app
RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*
# RUN npm install
RUN cd ./SnakeFrontend && yarn install --frozen-lockfile && yarn run build

# build api
# RUN npm install
RUN cd ./api && yarn install --frozen-lockfile && yarn run build

# production stage
FROM node:10-alpine
WORKDIR /app

RUN apk update
# Install nginx
RUN apk add nginx
RUN mkdir -p /run/nginx
RUN mkdir -p /usr/html/*
COPY ./SnakeFrontend/nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy API to image workdir
COPY --from=build-stage ./app/api/node_modules/ /app/api/node_modules
COPY --from=build-stage ./app/api/dist/ /app/api

# Copy web UI to nginx html dir
COPY --from=build-stage ./app/SnakeFrontend/dist/ /usr/share/nginx/html

EXPOSE 80
EXPOSE 8000
EXPOSE 3000

# Start command with web server and Node.js API
CMD nginx && node ./app/api/index.js && python ./app/SnakeBackend/manage.py runserver 0.0.0.0:8000