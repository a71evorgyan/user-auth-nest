## Description

Simple User auth app with [Nest.js](https://nestjs.com/)

## Installation

- Create a `.env` file from `.env.example` file and fill in the information
- Run the following command:

```bash
yarn
```

## Running the app

```bash
# development mode
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## Running with docker

1. copy `.env.example` file and set your env variables

```bash
#App
PORT=4000

#Mongo
MONGODB_URL=mongodb://mongodb:27017
MONGODB_DATABASE=users

#JWT
JWT_SECRET=key
```

2. Run
```bash
docker-compose up application
```
