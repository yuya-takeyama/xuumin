package main

import (
	"context"
	"log"
	"os"
	"time"

	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
)

const (
	defaultHost = "localhost"
	defaultPort = "50051"
)

func main() {
	log.Printf("Conecting to %s", getAddress())
	conn, err := grpc.Dial(getAddress(), grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}

	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	c := pb.NewDiagramServiceClient(conn)
	r, err := c.AddDiagram(ctx, &pb.AddDiagramRequest{
		Source: "foo",
	})
	if err != nil {
		log.Fatalf("could not add: %v", err)
	}
	log.Printf("Added diagram: Result: %s, Uuid: %s, Message: %s", r.Result, r.Uuid, r.Message)
}

func getAddress() string {
	var host string
	var port string

	envHost := os.Getenv("HOST")
	if envHost == "" {
		host = defaultHost
	} else {
		host = envHost
	}

	envPort := os.Getenv("PORT")
	if envPort == "" {
		port = defaultPort
	} else {
		port = envPort
	}

	return host + ":" + port
}
