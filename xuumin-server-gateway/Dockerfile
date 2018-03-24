FROM golang:1.10.0-alpine AS build-env

ENV GOPATH /go

WORKDIR /go/src/github.com/yuya-takeyama/xuumin

RUN apk add --update git protobuf protobuf-dev && \
  go get -u -v github.com/golang/protobuf/protoc-gen-go && \
  go get -u -v github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway

ADD . /go/src/github.com/yuya-takeyama/xuumin

RUN ./scripts/generate_pb_package && \
  ./scripts/generate_reverse_proxy && \
  cd xuumin-server-gateway && \
  go build

FROM alpine:3.7

WORKDIR /app
COPY --from=build-env /go/src/github.com/yuya-takeyama/xuumin/xuumin-server-gateway/xuumin-server-gateway /app

ENTRYPOINT ["/app/xuumin-server-gateway"]
