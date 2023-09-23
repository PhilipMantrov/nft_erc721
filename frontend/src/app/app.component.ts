import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  CreateNftCollectionRequest,
  CreateNftCollectionResponse,
  GetAllNftEventsResponse,
  MintNftRequest,
  MintNftResponse,
  NftEvent
} from "definitions/generated/nft/watcher/v1/watcher";
import { webSocket } from "rxjs/webSocket";
import { MatDialog } from "@angular/material/dialog";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public displayedColumns: string[] = ["event", "collection_address", "name", "symbol", "recipient_address", "tokenId", "tokenUri"];
  public dataSource: Array<NftEvent> = [];

  public showOverlay: boolean = false;

  public createCollectionRequest: CreateNftCollectionRequest = {
    name: "",
    symbol: ""
  };

  public createCollectionResponse: CreateNftCollectionResponse = {
    hash: "",
    collectionAddress: ""
  };

  public mintNftRequest: MintNftRequest = {
    collectionAddress: "",
    recipientAddress: "",
    tokenId: "",
    tokenUri: ""
  };

  public mintNftResponse: MintNftResponse = {
    hash: ""
  };

  constructor(private httpClient: HttpClient, public dialog: MatDialog) {
  }

  public ngOnInit() {
    this.httpClient.get<GetAllNftEventsResponse>(`http://localhost:8082/nft/watcher/v1/getAllNftEvents`)
      .subscribe(res => {
        this.dataSource = res.events;
        console.log(this.dataSource);
      });

    webSocket<{ result: NftEvent }>(`ws://localhost:8082/nft/watcher/v1/getNftEvents`).subscribe(res => {
      this.dataSource = [...this.dataSource, res.result];
      console.log(this.dataSource);
    });
  }

  public createNftCollection() {
    if (!!this.createCollectionRequest.symbol && !!this.createCollectionRequest.name) {
      this.showOverlay = true;
      this.httpClient.post<CreateNftCollectionResponse>(`http://localhost:8082/nft/watcher/v1/createNftCollection`, this.createCollectionRequest)
        .subscribe(res => {
          this.createCollectionResponse = res;
          this.showOverlay = false;
        });
    }
  }

  public mintNft() {
    if (!!this.mintNftRequest.collectionAddress.length &&
      !!this.mintNftRequest.recipientAddress.length &&
      !!this.mintNftRequest.tokenId.length &&
      !!this.mintNftRequest.tokenUri.length) {
      this.showOverlay = true;
      this.httpClient.post<MintNftResponse>(`http://localhost:8082/nft/watcher/v1/mintNft`, this.mintNftRequest)
        .subscribe(res => {
          this.mintNftResponse = res;
          this.showOverlay = false;
        });
    }
  }
}
