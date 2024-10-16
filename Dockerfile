FROM node:18.18.0 as base
ARG web=/opt/workspace
ENV NODE_OPTIONS=--max-old-space-size=4096
ARG BUILD_ENV
WORKDIR ${web}
COPY . ${web}
RUN yarn install --registry=https://registry.yarnpkg.com/
RUN yarn build:${BUILD_ENV}
FROM node:18.18.0-alpine
ARG web=/opt/workspace
WORKDIR ${web}
COPY --from=base ${web} ${web}
ENTRYPOINT yarn start
EXPOSE 3000