# Run to test image
# docker run -d --rm --name terrabrasilis_deforestation_dashboard terrabrasilis/deforestation-dashboard:<tag_version>
FROM node:12.8.1 as node

# to monitor the health of the running service based on this container
RUN apt-get update \
  && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
COPY ./src /app/src/
COPY ./config /app/config/
COPY ./ts*.json /app/
COPY ./.angular-cli.json /app/
COPY ./nginx-custom.conf /app/nginx-custom.conf

ARG BUILD_TYPE
ARG ENV
ARG env=$ENV

RUN npm run build-$BUILD_TYPE && rm -rf /app/node_modules

FROM nginx:1.13

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist /usr/share/nginx/html/

COPY --from=node /app/nginx-custom.conf /etc/nginx/conf.d/default.conf
