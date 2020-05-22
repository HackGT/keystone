# https://docs.docker.com/samples/library/node/
ARG NODE_VERSION=12.10.0
# https://github.com/Yelp/dumb-init/releases
ARG DUMB_INIT_VERSION=1.2.2

# Build container
FROM node:${NODE_VERSION}-alpine AS build
ARG DUMB_INIT_VERSION

WORKDIR /home/node

ADD . /home/node
RUN yarn install && yarn build && yarn cache clean

# Runtime container
FROM node:${NODE_VERSION}-alpine

WORKDIR /home/node

COPY --from=build /home/node /home/node

WORKDIR /home/node/projects/cms
ENV GROUND_TRUTH_URL https://login.hack.gt
ENV GROUND_TRUTH_CLIENT_ID default
ENV GROUND_TRUTH_CLIENT_SECRET default
ENV MONGO_URL mongodb://localhost:27017/keystone
ENV COOKIE_SECRET default
ENV BUILD_STAGE true
RUN yarn && yarn build

EXPOSE 3000
CMD ["yarn", "start"]
