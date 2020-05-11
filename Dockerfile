FROM node:10-alpine

RUN mkdir -p /usr/src/keystone
WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN yarn

RUN cd /user/src/keystone/projcets/cms && yarn build

EXPOSE 3000
CMD cd /user/src/keystone/projcets/cms && yarn start
