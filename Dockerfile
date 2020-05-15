FROM node:10-alpine

# Templating from registration repo
# RUN apk update && apk add bash git

WORKDIR /usr/src/keystone
COPY . /usr/src/keystone

RUN yarn

CMD ["yarn", "cms"]