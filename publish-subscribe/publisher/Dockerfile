FROM node:14.5-alpine
WORKDIR /publisher
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENTRYPOINT [ "node" ]
CMD ["publisher.js"]