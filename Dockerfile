FROM node

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src

EXPOSE 8080
CMD ["NODE_ENV=production node", "/src/index.js"]
