import { Controller, UseFilters } from "@nestjs/common";
import {
  CreateNftCollectionRequest,
  CreateNftCollectionResponse, GetAllNftEventsResponse, MintNftRequest, MintNftResponse,
  NftEvent,
  NftWatcherServiceController,
  NftWatcherServiceControllerMethods
} from "@generated/nft/watcher/v1/watcher";
import { Empty } from "@generated/google/protobuf/empty";
import { Observable } from "rxjs";
import { NftService } from "./nft.service";
import { Metadata } from "@grpc/grpc-js";
import { ExceptionsFilter } from "@common/filters/base-rpc-exception.filter";

@Controller('nft')
@NftWatcherServiceControllerMethods()
@UseFilters(new ExceptionsFilter())
export class NftController implements NftWatcherServiceController {

  constructor(private nftService: NftService) {
  }

  public getNftEvents(request: Empty, metadata?: Metadata): Observable<NftEvent> {
    return this.nftService.getNftEvents();
  }

  public getAllNftEvents(request: Empty, metadata?: Metadata): Observable<GetAllNftEventsResponse> {
    return this.nftService.getAllNftEvents();
  }

  public createNftCollection(request: CreateNftCollectionRequest, metadata?: Metadata): Observable<CreateNftCollectionResponse> {
    return this.nftService.createNftCollection(request);
  }

  public mintNft(request: MintNftRequest, metadata?: Metadata): Observable<MintNftResponse> {
    return this.nftService.mintNft(request);
  }
}
