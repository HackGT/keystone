FROM node:10-alpine

# Templating from registration repo
# RUN apk update && apk add bash git

WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN yarn
RUN cd /user/src/keystone/projects/cms; yarn build

EXPOSE 3000
CMD cd /user/src/keystone/projects/cms; yarn start
