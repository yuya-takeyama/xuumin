//go:generate protoc -I ../protos ../protos/xuumin.proto --go_out=plugins=grpc:pb

package main

import (
	"context"
	"log"
	"net"
	"os"

	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

const (
	defaultPort = "50051"
)

type server struct{}

func (s *server) AddDiagram(ctx context.Context, in *pb.AddDiagramRequest) (*pb.AddDiagramReply, error) {
	log.Printf("AddDiagram: %v", in)
	return &pb.AddDiagramReply{
		Result:  pb.AddDiagramReply_OK,
		Uuid:    "foo",
		Message: "",
	}, nil
}

func main() {
	var port string

	envPort := os.Getenv("PORT")
	if envPort == "" {
		port = defaultPort
	} else {
		port = envPort
	}

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterDiagramServiceServer(s, &server{})
	reflection.Register(s)
	log.Printf("Start listening on %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
