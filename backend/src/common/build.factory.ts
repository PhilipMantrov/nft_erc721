import { GrpcOptions } from "@nestjs/microservices";
import { NestFactory } from "@nestjs/core";
import { INestMicroservice } from "@nestjs/common";
import {
  NftWatcherGrpcOptions
} from "./confs";
import { NFT_WATCHER_V1_PACKAGE_NAME } from "@generated/nft/watcher/v1/watcher";
import { NftModule } from "../nft/nft.module";

export function getGrpcOptions(arg: string): GrpcOptions {
  switch (arg) {
    case NFT_WATCHER_V1_PACKAGE_NAME:
      return NftWatcherGrpcOptions;
    default:
      break;
  }
}

export function getModule(arg: string): any {
  switch (arg) {
    case NFT_WATCHER_V1_PACKAGE_NAME:
      return NftModule;
    default:
      break;
  }
}

export async function getMicroservice(val: string): Promise<INestMicroservice> {
  return await NestFactory.createMicroservice(getModule(val), {
    logger:
      process.env.NODE_ENV === `production`
        ? [`error`, `log`]
        : [`log`, `error`, `debug`, `verbose` /*, `warn`*/],
    ...getGrpcOptions(val),
  });
}
