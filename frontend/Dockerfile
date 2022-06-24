FROM node:17-alpine

WORKDIR /kimiapp

COPY package.json .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

