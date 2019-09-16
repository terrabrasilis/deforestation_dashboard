FROM node:9.2.0 as node

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

ARG BUILD_TYPE
ARG ENV

ARG env=$ENV

RUN npm run start-build-$BUILD_TYPE

FROM nginx:1.13

RUN rm -rf /usr/share/nginx/html/*

COPY --from=node /app/dist/ /usr/share/nginx/html/

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# used to allow external edition of this configuration files
RUN mkdir -p /assets/i18n && \
    rm /usr/share/nginx/html/assets/i18n/*.json && \
    cd /usr/share/nginx/html/assets/i18n && \
    ln -s /assets/i18n/en.json en.json && \
    ln -s /assets/i18n/pt-br.json pt-br.json

VOLUME ["/assets/i18n"]