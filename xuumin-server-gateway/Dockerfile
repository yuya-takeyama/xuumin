FROM golang:1.10.0-alpine AS build-env

WORKDIR /go/src/github.com/yuya-takeyama/xuumin

RUN apk add --update git

COPY ./vendor /go/src/github.com/yuya-takeyama/xuumin/vendor
COPY ./xuumin-server /go/src/github.com/yuya-takeyama/xuumin/xuumin-server
COPY ./xuumin-server-gateway /go/src/github.com/yuya-takeyama/xuumin/xuumin-server-gateway

RUN cd ./xuumin-server-gateway && go build

FROM alpine:3.7

WORKDIR /app
COPY --from=build-env /go/src/github.com/yuya-takeyama/xuumin/xuumin-server-gateway/xuumin-server-gateway /app

ENTRYPOINT ["/app/xuumin-server-gateway"]
