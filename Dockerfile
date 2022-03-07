FROM node:14-alpine as base

WORKDIR /src/app
COPY package*.json /
EXPOSE 3000


FROM base as dev
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "app.js"]