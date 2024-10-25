FROM node:20.16.0

WORKDIR /usr/local/ccported

COPY server/package.json /usr/local/ccported/

RUN npm install

COPY server/client.js /usr/local/ccported/
COPY server/index.js /usr/local/ccported/
ENV node_env=production
ENV port=3000

EXPOSE 3000

CMD ["node","index.js"];