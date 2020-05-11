FROM node:10-alpine

# Templating from registration repo
RUN apk update && apk add bash git

WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN apk --no-cache add --virtual native-deps g++ gcc libgcc libstdc++ linux-headers make python && \
  npm config set unsafe-perm true && \
  npm install --quiet node-gyp -g && \
  yarn && \
  apk del native-deps
RUN cd /user/src/keystone/projects/cms; yarn build

EXPOSE 3000
CMD cd /user/src/keystone/projects/cms; yarn start
