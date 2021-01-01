FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# RUN apk update && apk add yarn python g++ make && rm -rf /var/cache/apk/*

# build api
RUN npm i --no-progress
COPY . .
RUN npm run build

# production stage
FROM node:10-alpine
WORKDIR /app

RUN apk update

# Copy API to image workdir
COPY --from=build-stage ./app/node_modules/ /node_modules
COPY --from=build-stage ./app/dist/ .

EXPOSE 3000

# Start command with web server and Node.js API
CMD node ./index.js
