FROM node:19-alpine AS dist
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . ./
RUN yarn build:prod

FROM node:19-alpine
RUN mkdir -p /app
WORKDIR /app
COPY --from=dist dist /app/dist
COPY --from=dist node_modules /app/node_modules
COPY . /app
EXPOSE $PORT
CMD [ "yarn", "start:prod" ]