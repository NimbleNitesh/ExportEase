FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3001

CMD yarn dev