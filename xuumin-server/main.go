//go:generate protoc -I ../protos ../protos/xuumin.proto --go_out=plugins=grpc:pb

package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"

	_ "github.com/lib/pq"
	"github.com/satori/go.uuid"
	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

const (
	defaultPort = "50051"
)

var db *sql.DB

type server struct{}

func (s *server) AddDiagram(ctx context.Context, in *pb.AddDiagramRequest) (*pb.AddDiagramReply, error) {
	log.Printf("AddDiagram: %v", in)
	uuid := uuid.NewV4()

	stmt, err := db.Prepare("INSERT INTO diagrams (uuid, source) VALUES ($1, $2)")
	if err != nil {
		return addDiagramError(fmt.Sprintf("failed to insert a new diagram: failed to prepare: %s", err))
	}

	_, execErr := stmt.Exec(uuid.String(), in.Source)
	if err != nil {
		return addDiagramError(fmt.Sprintf("failed to insert a new diagram: failed execute statement: %s", execErr))

	}

	return &pb.AddDiagramReply{
		Result:  pb.AddDiagramReply_OK,
		Uuid:    uuid.String(),
		Message: "",
	}, nil
}

func addDiagramError(message string) (*pb.AddDiagramReply, error) {
	return &pb.AddDiagramReply{
		Result:  pb.AddDiagramReply_NG,
		Uuid:    "",
		Message: message,
	}, nil
}

func init() {
	var err error

	connStr := os.Getenv("DATABASE_URI")
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
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
