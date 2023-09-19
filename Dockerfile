FROM node:18.16.0-alpine as builder

ARG web=/opt/workspace/aelf-example

WORKDIR ${web}

COPY ./yarn.lock ${web}

RUN yarn install --registry=https://registry.yarnpkg.com/

COPY . ${web}

RUN yarn build

FROM node:18.16.0-alpine 

WORKDIR ${web}

COPY FROM=builder ${web} ${web}

ENTRYPOINT yarn start

EXPOSE 3000
