const EnvConfig = {
  SENTRY: {
    local: 'https://1aa30050674f428a9d48cda3f6689561@sentry.io/157613',
    staging: 'https://2159d482fde040bb958212cd9fba8e86@sentry.io/158023',
    prod: 'https://1544f77b023141678624b80c1c4110e6@sentry.io/157612'
  },
  GA: {
    local: 'UA-97028744-3',
    staging: 'UA-97028744-2',
    prod: 'UA-97028744-1'
  }
};

module.exports = function(TARGET_ENV) {
  const pkg = require('../package.json');

  return {
    NODE_MODULES: ['angular', 'lodash', 'angular-sanitize', 'angular-raven'],
    GA: EnvConfig.GA[TARGET_ENV],
    SENTRY: EnvConfig.SENTRY[TARGET_ENV],
    ENV: TARGET_ENV,
    VERSION: pkg.version,
    PATCH: pkg.patch,
    PORT: process.env.PORT || 3000
  };
};