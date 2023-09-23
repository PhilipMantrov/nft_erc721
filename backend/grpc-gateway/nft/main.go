package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/golang/glog"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/tmc/grpc-websocket-proxy/wsproxy"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	nft_pb "grpc-gateway/nft/pb"
	"net/http"
	"os"
	"strings"
)

func allowCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			if r.Method == "OPTIONS" && r.Header.Get("Access-Control-Request-Method") != "" {
				preflightHandler(w, r)
				return
			}
		}
		h.ServeHTTP(w, r)
	})
}

func preflightHandler(w http.ResponseWriter, r *http.Request) {
	headers := []string{"Content-Type", "Accept", "Authorization"}
	w.Header().Set("Access-Control-Allow-Headers", strings.Join(headers, ","))
	methods := []string{"GET", "HEAD", "POST", "PUT", "DELETE"}
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(methods, ","))
	glog.Infof("preflight request for %s", r.URL.Path)
}

func RequestMutator(incoming *http.Request, outgoing *http.Request) *http.Request {
	fmt.Println(incoming.URL.Path, incoming.URL.Query())
	return outgoing
}

func run() error {
	addr_nft_watcher := os.Getenv("NFT_WATCHER_PORT")
	if addr_nft_watcher == "" {
		addr_nft_watcher = "localhost:19000"
	}

	grpc_nft_watcher_endpoint := flag.String("grpc-nft-watcher-endpoint", addr_nft_watcher, "gRPC nft watcher endpoint")

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err_nft_watcher := nft_pb.RegisterNftWatcherServiceHandlerFromEndpoint(ctx, mux, *grpc_nft_watcher_endpoint, opts)

	errors := [1]error{err_nft_watcher}

	for i := range errors {
		if errors[i] != nil {
			return errors[i]
		}
	}

	grpc_gateway_port := ":" + os.Getenv("GRPC_GATEWAY_PORT")
	if grpc_gateway_port == ":" {
		grpc_gateway_port = ":8082"
	}

	// Start HTTP server (and proxy calls to gRPC server endpoint)
	return http.ListenAndServe(grpc_gateway_port, wsproxy.WebsocketProxy(allowCORS(mux), wsproxy.WithMaxRespBodyBufferSize(2.56e+8), wsproxy.WithRequestMutator(RequestMutator)))
}

func main() {
	flag.Parse()
	defer glog.Flush()

	if err := run(); err != nil {
		glog.Fatal(err)
	}
}
