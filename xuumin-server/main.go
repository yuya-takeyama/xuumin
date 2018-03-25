package main

import (
	"database/sql"
	"log"
	"net"
	"os"

	_ "github.com/lib/pq"
	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

const (
	defaultPort = "50051"
)

var db *sql.DB

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
	pb.RegisterDiagramServiceServer(s, &services{})
	reflection.Register(s)
	log.Printf("Start listening on %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
