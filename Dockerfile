FROM node:10-alpine

# Templating from registration repo
# RUN apk update && apk add bash git

RUN mkdir -p /usr/src/keystone
WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN yarn

FROM node:10-alpine
COPY --from=0 /usr/src/keystone/projects/cms /usr/src/keystone/projects/cms
WORKDIR /usr/src/keystone/projects/cms
RUN yarn
RUN yarn build

EXPOSE 3000
WORKDIR /usr/src/keystone/projects/cms
CMD ["yarn", "start"]