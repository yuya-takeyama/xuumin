package main

import (
	"bytes"
	"context"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	pb "github.com/yuya-takeyama/xuumin/xuumin-server/pb"
	"google.golang.org/grpc"
)

func main() {
	var port string

	plantumlServiceEndpoint := os.Getenv("PLANTUML_SERVICE_ENDPOINT")
	if plantumlServiceEndpoint == "" {
		panic("PLANTUML_SERVICE_ENDPOINT is not specified")
	}
	address := os.Getenv("GRPC_ENDPOINT")
	if address == "" {
		panic("GRPC_ENDPOINT is not specified")
	}
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	envPort := os.Getenv("PORT")
	if envPort == "" {
		port = "5000"
	} else {
		port = envPort
	}

	defer conn.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/diagrams/") && strings.HasSuffix(r.URL.Path, ".svg") {
			diagramID := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/diagrams/"), ".svg")
			log.Printf("diagramID: %s", diagramID)

			ctx, cancel := context.WithTimeout(context.Background(), time.Second)
			defer cancel()

			c := pb.NewDiagramServiceClient(conn)
			diagram, err := c.GetDiagram(ctx, &pb.GetDiagramRequest{
				Uuid: diagramID,
			})
			if err != nil {
				w.WriteHeader(500)
				log.Printf("did not get a diagram: %v", err)
				return
			}

			res, resErr := http.Post(plantumlServiceEndpoint+"/svg", "", bytes.NewBufferString(diagram.Source))
			if resErr != nil {
				w.WriteHeader(500)
				log.Printf("failed to receive image data from PlantUML Service: %v", resErr)
				return
			}

			defer res.Body.Close()

			w.Header().Set("Content-Type", "image/svg+xml")
			io.Copy(w, res.Body)
		} else {
			w.WriteHeader(404)
			log.Printf("invalid request: %s %s", r.Method, r.URL.Path)
		}
	})

	log.Printf("Start listening on %s...", port)
	http.ListenAndServe(":"+port, mux)
}
