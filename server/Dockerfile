FROM node:alpine

COPY ./package*.json ./
RUN npm install
COPY . .

RUN npm run test

CMD ["npm", "run", "start"]
