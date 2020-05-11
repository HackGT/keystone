const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');

const { Hackathon, Event, Location, Type, FAQ, Block, User } = require('./schema');
const GroundTruthAuthStrategy = require('./auth/GroundTruthAuthStrategy');
const defaultUserPermissions = require('./defaultUserPermissions')

require('dotenv').config();

const keystone = new Keystone({
  name: 'HackGT CMS',
  adapter: new MongooseAdapter({
    mongoUri: 'mongodb://localhost/cms-keystone'
  })
});

cookie = {
  secure: process.env.NODE_ENV === 'production', // Defaults to true in production
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  sameSite: false,
};

keystone.createList('Hackathon', Hackathon);
keystone.createList('Event', Event);
keystone.createList('Location', Location);
keystone.createList('FAQ', FAQ);
keystone.createList('Block', Block);
keystone.createList('Type', Type);
keystone.createList('User', User);

const groundTruthStrategy = keystone.createAuthStrategy({
  type: GroundTruthAuthStrategy,
  list: 'User',
  config: {
    idField: 'groundTruthId',
    appId: process.env.GROUND_TRUTH_CLIENT_ID,
    appSecret: process.env.GROUND_TRUTH_CLIENT_SECRET,
    loginPath: '/auth/ground',
    callbackPath: '/auth/ground/callback',
    onAuthenticated: (data, req, res) => {
      res.redirect('/admin');
    },

    onError: (error, req, res) => {
      res.redirect('/error');
    },

    resolveCreateData: ({ createData, serviceProfile }, req, res) => {
      if (!serviceProfile.name || !serviceProfile.email) {
        res.redirect('/error');
      }
      createData.name = serviceProfile.name;
      createData.email = serviceProfile.email;

      if (createData.email in defaultUserPermissions) {
        createData.permissionLevel = defaultUserPermissions[createData.email];
      } else {
        createData.permissionLevel = 'GENERAL';
      }

      return createData;
    }
  }
})

const graphQLApp = new GraphQLApp({})

const adminApp = new AdminUIApp({
  authStrategy: groundTruthStrategy,
  hooks: require.resolve('./admin/'),
})

module.exports = {
  keystone,
  apps: [
    graphQLApp,
    adminApp
  ],
};