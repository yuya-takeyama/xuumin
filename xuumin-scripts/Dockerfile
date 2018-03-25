FROM golang:1.10.0-alpine AS build-env

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

FROM alpine:3.7

WORKDIR /app
COPY --from=build-env /go/bin/protoc-gen-go /app
COPY --from=build-env /go/bin/protoc-gen-grpc-gateway /app
COPY --from=build-env /usr/local/bin/watchman /app

RUN apk add --update protobuf protobuf-dev openssl-dev && \
  mkdir -pv /usr/local/var/run/watchman/root-state

ENV PATH=/app:$PATH
ENV GOPATH=/go

WORKDIR /go/src/github.com/yuya-takeyama/xuumin

CMD watchman -- \
  trigger . protofiles 'protos/*.proto' -- \
  /go/src/github.com/yuya-takeyama/xuumin/xuumin-scripts/generate_pb_package && \
  tail -f /usr/local/var/run/watchman/root-state/log
