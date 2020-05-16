FROM node:10-alpine

# Templating from registration repo
# RUN apk update && apk add bash git

RUN mkdir -p /usr/src/keystone
WORKDIR /usr/src/keystone
COPY . /usr/src/keystone

RUN yarn

EXPOSE 3000
CMD ["yarn", "cms"]