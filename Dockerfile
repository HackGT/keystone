FROM node:10-alpine

RUN mkdir -p /usr/src/keystone
WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN npm install --unsafe-perm

FROM node:10-alpine
WORKDIR /usr/src/keystone/projects/cms
COPY . /usr/src/keystone/projects/cms
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
