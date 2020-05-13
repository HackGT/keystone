FROM node:10-alpine

# Templating from registration repo
# RUN apk update && apk add bash git

WORKDIR /usr/src/keystone
COPY . /usr/src/keystone
RUN yarn

FROM node:10-alpine
COPY --from=0 /user/src/keystone/projects/cms
WORKDIR /user/src/keystone/projects/cms
RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]
