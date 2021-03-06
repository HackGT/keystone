const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');

const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

const { Hackathon, Event, Location, Type, FAQ, Block, User, Sponsor, Perk, Challenge, BrandAsset, SocialAccount, Tag } = require('./schema');
const GroundTruthAuthStrategy = require('./auth/GroundTruthAuthStrategy');
const defaultUserPermissions = require('./defaultUserPermissions');

require('dotenv').config();

const keystone = new Keystone({
  name: 'HackGT CMS',
  adapter: new MongooseAdapter({
    mongoUri: process.env.MONGO_URL,
  }),
  cookieSecret: process.env.COOKIE_SECRET,
  cookie: {
    secure: true // Change to false to run production mode locally, see https://www.keystonejs.com/keystonejs/keystone/#secure
  },
  // Fixes build error - https://github.com/keystonejs/keystone/issues/2350
  sessionStore: process.env.BUILD_STAGE == "true" ? null : new MongoStore({ url: process.env.MONGO_URL })
});

keystone.createList('Hackathon', Hackathon);
keystone.createList('Event', Event);
keystone.createList('Location', Location);
keystone.createList('FAQ', FAQ);
keystone.createList('Block', Block);
keystone.createList('Type', Type);
keystone.createList('User', User);
keystone.createList('Sponsor', Sponsor);
keystone.createList('Perk', Perk);
keystone.createList('Challenge', Challenge);
keystone.createList('BrandAsset', BrandAsset);
keystone.createList('SocialAccount', SocialAccount);
keystone.createList('Tag', Tag);

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
        createData.permissionLevel = 'NONE';
      }

      return createData;
    }
  }
});

const graphQLApp = new GraphQLApp({});

const adminApp = new AdminUIApp({
  authStrategy: groundTruthStrategy,
  hooks: require.resolve('./admin/'),
  isAccessAllowed: ({ authentication: { item: user } }) => Boolean(!!user && user.permissionLevel != 'NONE')
});

const staticApp = new StaticApp({
  path: '/',
  src: 'public',
  fallback: 'index.html',
});

module.exports = {
  keystone,
  apps: [graphQLApp, adminApp, staticApp],
  configureExpress: app => {
    app.set('trust proxy', true);
  }
};
