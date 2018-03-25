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
		return nil, fmt.Errorf("failed to insert a new diagram: failed to prepare: %s", err)
	}

	_, execErr := stmt.Exec(uuid.String(), in.Source)
	if err != nil {
		return nil, fmt.Errorf("failed to insert a new diagram: failed execute statement: %s", execErr)
	}

	return &pb.AddDiagramReply{
		Uuid:   uuid.String(),
		Source: in.Source,
	}, nil
}

func (s *services) GetDiagram(ctx context.Context, in *pb.GetDiagramRequest) (*pb.GetDiagramReply, error) {
	log.Printf("GetDiagram: %v", in)

	stmt, err := db.Prepare("SELECT uuid, source FROM diagrams WHERE uuid = $1 LIMIT 1")
	if err != nil {
		return nil, fmt.Errorf("failed to get a diagram: failed to prepare: %s", err)
	}

	var uuid string
	var source string
	execErr := stmt.QueryRow(in.Uuid).Scan(&uuid, &source)
	if execErr != nil {
		return nil, fmt.Errorf("failed to get a diagram: failed to execute query: %s", execErr)
	}

	return &pb.GetDiagramReply{
		Uuid:   uuid,
		Source: source,
	}, nil
}
