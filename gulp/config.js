const EnvConfig = {
  SENTRY: {
    local: 'https://1aa30050674f428a9d48cda3f6689561@sentry.io/157613',
    staging: 'https://98de5dacdaf54adfa6f76edc967c23b7@sentry.io/158403',
    alpha: 'https://2159d482fde040bb958212cd9fba8e86@sentry.io/158023',
    production: 'https://1544f77b023141678624b80c1c4110e6@sentry.io/157612'
  },
  GA: {
    local: 'UA-97028744-4',
    staging: 'UA-97028744-3',
    alpha: 'UA-97028744-2',
    production: 'UA-97028744-1'
  },
  ISSUES: {
    local: '#',
    staging: '#',
    alpha: 'https://goo.gl/forms/cZX8d2r8Y6JTNgE63',
    prod: '#'
  },
  FEEDBACK: {
    local: '#',
    staging: '#',
    alpha: 'https://goo.gl/forms/rwY5hkVw7FSH2DA62',
    prod: '#'
  }
};

module.exports = function(TARGET_ENV) {
  const pkg = require('../package.json');

  return {
    NODE_MODULES: ['angular', 'lodash', 'angular-sanitize', 'angular-raven'],
    GA: EnvConfig.GA[TARGET_ENV],
    SENTRY: EnvConfig.SENTRY[TARGET_ENV],
    ISSUES: EnvConfig.ISSUES[TARGET_ENV],
    FEEDBACK: EnvConfig.FEEDBACK[TARGET_ENV],
    ENV: TARGET_ENV,
    VERSION: pkg.version,
    PATCH: pkg.patch,
    PORT: process.env.PORT || 3000,
    REPO: pkg.repository.url
  };
};