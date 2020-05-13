const PassportGroundTruth = require('./strategy');
const { PassportAuthStrategy } = require('@keystonejs/auth-passport');

class GroundTruthAuthStrategy extends PassportAuthStrategy {
    constructor(keystone, listKey, config) {
        super(GroundTruthAuthStrategy.authType, keystone, listKey, config, PassportGroundTruth);
    }
}

GroundTruthAuthStrategy.authType = 'groundTruth';
module.exports = GroundTruthAuthStrategy;
