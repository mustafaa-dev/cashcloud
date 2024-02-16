FROM node:alpine
WORKDIR /home/node/app/
RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm install --force
COPY src .
#CMD ["node","dist/src/main"]
CMD ["npm", "run", "start:dev"]