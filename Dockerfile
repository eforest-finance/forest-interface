FROM node:18.17.0 as base

ARG web=/opt/workspace

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR ${web}

COPY . ${web}

RUN yarn install --registry=https://registry.yarnpkg.com/

RUN yarn build
    
FROM node:18.17.0-alpine

ARG web=/opt/workspace

WORKDIR ${web}

COPY --from=base ${web} ${web}

ENTRYPOINT yarn start -p 3004

EXPOSE 3004
