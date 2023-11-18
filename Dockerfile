FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 443

CMD [ "node", "src/server.js"]