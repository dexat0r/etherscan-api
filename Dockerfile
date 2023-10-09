FROM node:18-alpine as modules

COPY package*.json ./

RUN npm install


FROM node:18-alpine

WORKDIR /app

COPY . .
COPY --from=modules node_modules /app/node_modules

RUN npm run build
