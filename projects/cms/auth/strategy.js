const { URL } = require('url');
const { Strategy: OAuthStrategy } = require('passport-oauth2');

class GroundTruthStrategy extends OAuthStrategy {

    constructor(options, verify) {
        if (!options || !options.clientID || !options.clientSecret) {
            throw new Error(`Client ID or secret not configured in environment variables for Ground Truth`);
        }

        options = {
            authorizationURL: new URL("/oauth/authorize", process.env.GROUND_TRUTH_URL).toString(),
            tokenURL: new URL("/oauth/token", process.env.GROUND_TRUTH_URL).toString(),
            ...options,
        }

        super(options, verify);
        this.name = "groundTruth";
    }

    userProfile(accessToken, done) {
        (this._oauth2)._request("GET", new URL("/api/user", process.env.GROUND_TRUTH_URL).toString(), null, null, accessToken, (err, data) => {
            if (err) {
                done(err);
                return;
            }
            try {
                let profile = {
                    ...JSON.parse(data),
                    token: accessToken
                };
                if (profile.uuid) {
                    profile.id = profile.uuid;
                    done(null, profile);
                } else {
                    done(new Error("No uuid on user profile"));
                }
            }
            catch (err) {
                return done(err);
            }
        });
    }
}

module.exports = GroundTruthStrategy;