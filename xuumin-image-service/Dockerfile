FROM golang:1.10.0-alpine AS build-env

WORKDIR /go/src/github.com/yuya-takeyama/xuumin

RUN apk add --update git

COPY ./vendor /go/src/github.com/yuya-takeyama/xuumin/vendor
COPY ./xuumin-server /go/src/github.com/yuya-takeyama/xuumin/xuumin-server
COPY ./xuumin-image-service /go/src/github.com/yuya-takeyama/xuumin/xuumin-image-service

RUN cd ./xuumin-image-service && go build

FROM alpine:3.7

WORKDIR /app
COPY --from=build-env /go/src/github.com/yuya-takeyama/xuumin/xuumin-image-service/xuumin-image-service /app

ENTRYPOINT ["/app/xuumin-image-service"]
