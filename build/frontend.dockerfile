FROM node:12.7-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY ./ ./

RUN yarn
RUN yarn protoc
RUN cd frontend
RUN yarn
RUN yarn start
