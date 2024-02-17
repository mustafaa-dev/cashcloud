#FROM node:alpine
#WORKDIR /usr/src/app/
#RUN npm install -g @nestjs/cli
#COPY package*.json ./
#RUN npm install --force
#COPY . .
#CMD ["node","dist/src/main"]
#CMD ["npm", "run", "start:dev"]



FROM node:alpine

WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

COPY package*.json .

RUN npm install

COPY . .