/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Environment variables.
const ENV_KEY_DEVELOPMENT = 'development';
const ENV_KEY_TEST = 'test';
const ENV_KEY_STAGING = 'staging';
const ENV_KEY_PRODUCTION = 'production';
const env = process.env.NODE_ENV || ENV_KEY_DEVELOPMENT;

export default {
  env,
  isDev: (env === ENV_KEY_DEVELOPMENT || env === ENV_KEY_TEST),
  isProd: (env === ENV_KEY_PRODUCTION),
  isStaging: (env === ENV_KEY_STAGING),
  isRemote: process.env.REMOTE,
};
