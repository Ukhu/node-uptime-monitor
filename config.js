const environments = {};

environments.staging = {
  'port': 3000,
  'envName': 'staging'
}

environments.production = {
  'port': 5000,
  'envName': 'production'
}

const selectedEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

const envToExport = typeof(environments[selectedEnv]) === 'object' ? environments[selectedEnv] : environments.staging;

module.exports = envToExport;