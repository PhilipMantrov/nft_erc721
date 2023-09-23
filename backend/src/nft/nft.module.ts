import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { GrpcReflectionModule } from "nestjs-grpc-reflection";
import { NftWatcherGrpcOptions } from "@common/confs";

@Module({
  imports: [
    GrpcReflectionModule.register(NftWatcherGrpcOptions),
  ],
  controllers: [NftController],
  providers: [NftService]
})
export class NftModule {}
