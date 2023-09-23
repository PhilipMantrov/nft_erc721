import { GrpcOptions, Transport } from "@nestjs/microservices";
import { addReflectionToGrpcConfig } from "nestjs-grpc-reflection";
import { NFT_WATCHER_V1_PACKAGE_NAME } from "@generated/nft/watcher/v1/watcher";
import { join } from "path";

export const NftWatcherGrpcOptions: GrpcOptions = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${process.env.NFT_WATCHER_PORT ? process.env.NFT_WATCHER_PORT : 19000}`,
    package: NFT_WATCHER_V1_PACKAGE_NAME,
    protoPath: join(`nft/watcher/v1/watcher.proto`),
    maxSendMessageLength: 30 * 1024 * 1024,
    maxReceiveMessageLength: 30 * 1024 * 1024,
    loader: {
      arrays: true,
      objects: true,
      keepCase: true,
      includeDirs: [`definitions/protocol-buffers`],
    },
  },
});
