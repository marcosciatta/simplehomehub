const systemConfig = {
  NODE_ENV: process.env.NODE_ENV || process.env.npm_package_config_NODE_ENV,
  APP_PORT: process.env.APP_PORT || process.env.npm_package_config_APP_PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || process.env.npm_package_config_LOG_LEVEL || 'DEBUG'
};

export default systemConfig;
