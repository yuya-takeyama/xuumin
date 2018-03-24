package main

import (
	"context"
	"fmt"
	"log"

	"github.com/satori/go.uuid"
	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
)

type services struct{}

func (s *services) AddDiagram(ctx context.Context, in *pb.AddDiagramRequest) (*pb.AddDiagramReply, error) {
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
