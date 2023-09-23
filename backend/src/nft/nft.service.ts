import { Injectable } from "@nestjs/common";
import {
  CreateNftCollectionRequest,
  CreateNftCollectionResponse,
  GetAllNftEventsResponse,
  MintNftRequest,
  MintNftResponse,
  NftEvent,
  NftWatcherServiceController
} from "@generated/nft/watcher/v1/watcher";
import { from, map, Observable, of, Subject, switchMap, tap } from "rxjs";
import { Metadata } from "@grpc/grpc-js";
import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers";
import { NFTCollection__factory } from "../../typechain-types";

@Injectable()
export class NftService implements NftWatcherServiceController {

  private nftEvent$: Subject<NftEvent> = new Subject<NftEvent>();

  private inMemoryStorage: Array<NftEvent> = []; // ToDo: move into DB

  private NFTCollection: NFTCollection__factory;

  constructor() {
    from(ethers.getContractFactory("NFTCollection")).subscribe(contract => this.NFTCollection = contract);
    this.nftEvent$.subscribe(event => this.inMemoryStorage.push(event));
  }

  public getNftEvents(): Observable<NftEvent> {
    return this.nftEvent$;
  }

  public getAllNftEvents(): Observable<GetAllNftEventsResponse> {
    return of({ events: this.inMemoryStorage });
  }

  public createNftCollection(request: CreateNftCollectionRequest, metadata?: Metadata): Observable<CreateNftCollectionResponse> {
    return from(this.NFTCollection.deploy(request.name, request.symbol)).pipe(
      tap(nft => this.eventMachine(nft.deploymentTransaction())),
      switchMap(nft => from(nft.getAddress()).pipe(map(address => {
        return {
          hash: nft.deploymentTransaction().hash,
          collection_address: address
        }
      })))
    );
  }

  public mintNft(request: MintNftRequest, metadata?: Metadata): Observable<MintNftResponse> {
    return from(ethers.getContractAt("NFTCollection", request.collection_address)).pipe(
      switchMap(contract => from(contract.safeMint(request.recipient_address, request.tokenId, request.tokenUri))),
      tap(tx => this.eventMachine(tx)),
      map(tx => {
        return {
          hash: tx.hash
        }
      }),
    );
  }

  private eventMachine(tx: ContractTransactionResponse) {
    from(tx.wait()).pipe().subscribe(tx => {
      tx.logs.forEach(log => {
        const decoded_log = this.NFTCollection.interface.parseLog(log as any);
        switch (decoded_log.name) {
          case 'TokenMinted':
            this.nftEvent$.next({
              mint: {
                collection_address: decoded_log.args[0],
                recipient_address: decoded_log.args[1],
                tokenId: decoded_log.args[2],
                tokenUri: decoded_log.args[3]
              }
            })
            break;
          case 'CollectionCreated':
            this.nftEvent$.next({
              collection: {
                collection_address: decoded_log.args[0],
                name: decoded_log.args[1],
                symbol: decoded_log.args[2],
              }
            })
        }
      })
    });
  }

}
