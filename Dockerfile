FROM node:alpine
WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install
COPY src .
CMD ["node","dist/src/main"]
