FROM node:alpine
WORKDIR '/catchypass'
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY --from=0 /catchypass/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf