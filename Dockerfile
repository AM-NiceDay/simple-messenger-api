FROM node:alpine

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src

EXPOSE 8080
CMD ["node", "/src/index.js"]
