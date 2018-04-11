const systemConfig = {
  NODE_ENV: process.env.NODE_ENV || process.env.npm_package_config_NODE_ENV,
  APP_PORT: process.env.APP_PORT || process.env.npm_package_config_APP_PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || process.env.npm_package_config_LOG_LEVEL || 'DEBUG',
  MONGO_URI: process.env.MONGO_URI || process.env.npm_package_config_MONGO_URI,
  MONGO_PORT: process.env.MONGO_PORT || process.env.npm_package_config_MONGO_PORT,
  MONGOOSE_DEBUG: process.env.MONGOOSE_DEBUG || process.env.npm_package_config_MONGOOSE_DEBUG,
  REDIS_URI: process.env.REDIS_URI || process.env.npm_package_config_REDIS_URI
};

export default systemConfig;
