FROM node:16

RUN mkdir -p ../docker/app

COPY . ../docker/app

RUN npm install

EXPOSE 3000

CMD ["nodemon", "/src/server.js"]
