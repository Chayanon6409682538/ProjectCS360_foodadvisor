FROM node:16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn seed

RUN yarn build

COPY . .

EXPOSE 1337

CMD ["yarn", "start"]
