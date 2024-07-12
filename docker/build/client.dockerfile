FROM node:21-alpine3.18 AS base
WORKDIR /app
RUN npm config rm proxy
RUN npm config rm https-proxy

FROM base AS build
COPY *.json vite.config.ts index.html ./
COPY src/ src/
RUN npm install
RUN npm run build

FROM node:21-alpine3.18 AS deploy
WORKDIR /app
COPY ./public *.json vite.config.ts index.html ./
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8080
CMD [ "npx", "vite", "preview", "--port", "8080", "--host"]
