## Requirements

* [Node.js](https://nodejs.org/en/download/) 16+
* [protobuf](https://github.com/protocolbuffers/protobuf/releases) 22+
* [go](https://go.dev/dl/) 1.20+
* [yarn](https://yarnpkg.com/getting-started/install) 1.21+

## Installation

```bash
$ go install \
        github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest \
        github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest
```

```bash
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

```bash
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

```bash
$ go install github.com/mitchellh/gox@latest
```

## Minimal Environments
```
ETH_NODE_API_URL
ETH_DEPLOY_PRIVATE_KEY
```

## Building and running app

### Build protocs for backend, grpc-gateway and frontend
```bash 
$ yarn
$ yarn protoc
```

### Build and start backend
```bash
$ cd backend
$ yarn
$ yarn build-contract
$ yarn build
$ yarn start:backend
```

### Build and start grpc-gateway
```bash
$ cd backend
$ yarn build:gateway
$ yarn start:gateway:linux <-- for linux
$ yarn start:gateway:win <-- for windows
$ yarn start:gateway:mac <-- for mac
$ yarn start:gateway:mac_arm <-- for mac on apple silicon
```

### Start frontend app
```bash
$ cd frontend
$ yarn
$ yarn start


go to http://localhost:4200
```
