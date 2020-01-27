# Socket IO Server

> The Socket io server side for the snake game, built with TypeScript and Express.js and Socket io

## Structure

-   `src/index.ts`: entry file for the app that starts of express server and contains all ENV variables
-   `src/App.class.ts`: express app class where middleware is configured
-   `src/routes/`: directory for all routes; all `*.routes.ts` files in here are automatically included by `index.ts` and injected into `App.class.ts`.
-   `test/`: directory for all tests

## Prerequisites and Usage

-   Install Node.js: <https://nodejs.org/en/download/>
-   Run `npm install` in this directory to install dependencies of this project

## Environment Variables for Configuration

The following ENV variables can be used to override the defaults:

-   `PORT`: the port the API runs on (default: `3000`)

## Detailed Build Setup and Commands

```bash
# install dependencies
npm install

# serve locally with hot reload on localhost:3000 (adjustable in `src/config/config.ts` or with ENV variable `PORT`)
npm start

# build node.js version for production
npm run build

# serve local production build
npm run start-prod

# run TypeScript linter
npm run lint

# run tests
npm test
```
