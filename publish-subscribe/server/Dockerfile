FROM node:14.5-alpine
WORKDIR /server
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENTRYPOINT [ "node" ]
CMD ["server.js"]