FROM buildkite/puppeteer
WORKDIR '/catchypass'

COPY ./package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "test"]