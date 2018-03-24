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
	defaultPort     = "6000"
	defaultEndpoint = "localhost:5000"
)

func run() error {
	var port string
	var endpoint string

	envPort := os.Getenv("PORT")
	if envPort == "" {
		port = defaultPort
	} else {
		port = envPort
	}
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

	log.Printf("Start listening on %s", port)
	return http.ListenAndServe(":"+port, mux)
}

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}
