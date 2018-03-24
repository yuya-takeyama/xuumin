FROM golang:1.10.0-alpine AS build-env

ENV GOPATH /go

WORKDIR /go/src/github.com/yuya-takeyama/xuumin

RUN apk add --update git protobuf && \
  go get -u -v github.com/golang/protobuf/protoc-gen-go

ADD . /go/src/github.com/yuya-takeyama/xuumin

RUN ./scripts/generate_pb_package && \
  cd xuumin-server && \
  go build

FROM alpine:3.7

WORKDIR /app
COPY --from=build-env /go/src/github.com/yuya-takeyama/xuumin/xuumin-server/xuumin-server /app

ENTRYPOINT ["/app/xuumin-server"]
