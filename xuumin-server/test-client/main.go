package main

import (
	"context"
	"log"
	"time"

	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
)

const (
	address = "localhost:50051"
)

func main() {
	conn, err := grpc.Dial(address, grpc.WithInsecure())
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
