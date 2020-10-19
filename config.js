const environments = {};

environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
}

environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
}

const selectedEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

const envToExport = typeof(environments[selectedEnv]) === 'object' ? environments[selectedEnv] : environments.staging;

module.exports = envToExport;