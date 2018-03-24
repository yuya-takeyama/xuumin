//go:generate protoc -I ../protos -I ../vendor/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis --grpc-gateway_out=logtostderr=true:../xuumin-server/pb ../protos/xuumin.proto

package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	gw "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
)

const (
	defaultEndpoint = "localhost:5000"
)

func run() error {
	var endpoint string

	envEndpoint := os.Getenv("GRPC_ENDPOINT")
	if envEndpoint == "" {
		endpoint = defaultEndpoint
	} else {
		endpoint = envEndpoint
	}

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()}
	err := gw.RegisterDiagramServiceHandlerFromEndpoint(ctx, mux, endpoint, opts)
	if err != nil {
		return err
	}

	return http.ListenAndServe(":8080", mux)
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
