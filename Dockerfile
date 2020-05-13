FROM node:10-alpine

# Templating from registration repo
# RUN apk update && apk add bash git

WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN yarn

FROM node:12.4-alpine
WORKDIR /user/src/keystone/projects/cms
RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]
