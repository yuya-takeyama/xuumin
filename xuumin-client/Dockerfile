FROM node:8.10-alpine

WORKDIR /app

COPY ./xuumin-client/package.json \
  ./xuumin-client/yarn.lock \
  ./xuumin-client/tsconfig.json \
  ./xuumin-client/tslint.json \
  /app/

CMD yarn start
