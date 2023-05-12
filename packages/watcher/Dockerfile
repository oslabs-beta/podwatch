FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN yarn --production=true
COPY . .
CMD ["yarn", "start"]