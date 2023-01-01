FROM node:18

RUN mkdir /app
WORKDIR /app

RUN npm upgrade -g yarn
COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . .

EXPOSE 3000
CMD [ "node", "dist/main" ]
