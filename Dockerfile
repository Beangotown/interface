FROM node:18.16.0

ARG web=/opt/workspace/aelf-example

WORKDIR ${web}

COPY . ${web}

RUN yarn \
    && yarn build-dev

ENTRYPOINT yarn start

EXPOSE 3000


FROM node:20.11.0

ARG web=/opt/workspace/aelf-example

WORKDIR ${web}

COPY . ${web}

ARG ENVIRONMENT
RUN yarn && \ 
    if [ "$ENVIRONMENT" = "mainnet" ]; \
    then yarn build;\ 
    elif [ "$ENVIRONMENT" = "testnet" ]; \
    then yarn build-test; \
    fi

ENTRYPOINT yarn start

EXPOSE 3000

