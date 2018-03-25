FROM golang:1.10.0-alpine AS build-env

ENV GOPATH /go

WORKDIR /go/src/github.com/yuya-takeyama/xuumin

RUN apk add --update git protobuf protobuf-dev

RUN git clone --depth 1 -b v4.9.0 https://github.com/facebook/watchman.git && \
  apk add --update bash libtool m4 automake autoconf build-base linux-headers openssl-dev && \
  cd watchman && \
  ./autogen.sh && \
  ./configure && \
  make && \
  make install && \
  apk del bash libtool m4 automake autoconf build-base linux-headers && \
  cd ../ && \
  rm -rf watchman

COPY ./vendor /go/src/github.com/yuya-takeyama/xuumin/vendor

RUN go get -v ./vendor/github.com/golang/protobuf/protoc-gen-go && \
  go get -v ./vendor/github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway

CMD watchman -- \
  trigger . protofiles 'protos/*.proto' -- \
  /go/src/github.com/yuya-takeyama/xuumin/xuumin-scripts/generate_pb_package && \
  tail -f /usr/local/var/run/watchman/root-state/log
