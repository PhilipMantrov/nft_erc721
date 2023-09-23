FROM golang:alpine3.16 as builder

WORKDIR /app

ENV NODE_ENV=production

RUN apk update && apk add nodejs npm protobuf-dev make gcc libc-dev
RUN npm install yarn -g

COPY ./ ./

RUN go install \
        github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest \
        github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
RUN go install github.com/mitchellh/gox@latest

RUN yarn
RUN yarn protoc
RUN cd backend
RUN yarn build-contract
RUN yarn build
RUN yarn build:gateway

ENV API_URL add_your_api_url
ENV PRIVATE_KEY add_your_private_key

FROM node:18.16.0-alpine

COPY --from=builder /app/bundle ./
RUN yarn
ENTRYPOINT ["bin/nft_gateway_linux_amd64", "&&", "node", "server.js", "nft.watcher.v1"]
