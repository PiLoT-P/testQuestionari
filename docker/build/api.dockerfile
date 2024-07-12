FROM node:21-alpine3.18 AS base
WORKDIR /app
RUN npm config rm proxy
RUN npm config rm https-proxy
RUN npm install npm@latest -g
COPY . .
RUN npm install
EXPOSE 4000
CMD ["node", "server.js"]