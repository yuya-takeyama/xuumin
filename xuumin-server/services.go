package main

import (
	"context"
	"fmt"
	"log"

	"github.com/satori/go.uuid"
	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
)

type services struct{}

func (s *services) GetDiagrams(ctx context.Context, in *pb.GetDiagramsRequest) (*pb.Diagrams, error) {
	var diagrams []*pb.Diagram

	rows, err := db.Query("SELECT uuid, source, title FROM diagrams")
	if err != nil {
		return nil, fmt.Errorf("failed to fetch diagrams: %s", err)
	}

	defer rows.Close()

	for rows.Next() {
		var uuid string
		var source string
		var title string
		err = rows.Scan(&uuid, &source, &title)
		if err != nil {
			return nil, fmt.Errorf("failed to scan a record: %s", err)
		}
		diagrams = append(diagrams, &pb.Diagram{
			Uuid:   uuid,
			Source: source,
			Title:  title,
		})
	}

	return &pb.Diagrams{
		Diagrams: diagrams,
	}, nil
}

func (s *services) AddDiagram(ctx context.Context, in *pb.AddDiagramRequest) (*pb.Diagram, error) {
	log.Printf("AddDiagram: %v", in)
	uuid := uuid.NewV4()

	if in.Title == "" || in.Source == "" {
		return nil, fmt.Errorf("title and source are required")
	}

	stmt, err := db.Prepare("INSERT INTO diagrams (uuid, source, title) VALUES ($1, $2, $3)")
	if err != nil {
		return nil, fmt.Errorf("failed to insert a new diagram: failed to prepare: %s", err)
	}

	_, execErr := stmt.Exec(uuid.String(), in.Source, in.Title)
	if err != nil {
		return nil, fmt.Errorf("failed to insert a new diagram: failed execute statement: %s", execErr)
	}

	return &pb.Diagram{
		Uuid:   uuid.String(),
		Source: in.Source,
		Title:  in.Title,
	}, nil
}

func (s *services) GetDiagram(ctx context.Context, in *pb.GetDiagramRequest) (*pb.Diagram, error) {
	log.Printf("GetDiagram: %v", in)

	stmt, err := db.Prepare("SELECT uuid, source, title FROM diagrams WHERE uuid = $1 LIMIT 1")
	if err != nil {
		return nil, fmt.Errorf("failed to get a diagram: failed to prepare: %s", err)
	}

	var uuid string
	var source string
	var title string
	execErr := stmt.QueryRow(in.Uuid).Scan(&uuid, &source, &title)
	if execErr != nil {
		return nil, fmt.Errorf("failed to get a diagram: failed to execute query: %s", execErr)
	}

	return &pb.Diagram{
		Uuid:   uuid,
		Source: source,
		Title:  title,
	}, nil
}

func (s *services) UpdateDiagram(ctx context.Context, in *pb.UpdateDiagramRequest) (*pb.Diagram, error) {
	log.Printf("UpdateDiagram: %v", in)

	stmt, err := db.Prepare("UPDATE diagrams SET title = $2, source = $3 WHERE uuid = $1")
	if err != nil {
		return nil, fmt.Errorf("failed to update a diagram: failed to prepare: %s", err)

	}

	_, execErr := stmt.Exec(in.Uuid, in.Title, in.Source)
	if err != nil {
		return nil, fmt.Errorf("failed to update a new diagram: failed execute statement: %s", execErr)
	}

	return &pb.Diagram{
		Uuid:   in.Uuid,
		Source: in.Source,
		Title:  in.Title,
	}, nil
}
