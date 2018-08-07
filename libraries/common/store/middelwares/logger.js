import { createLogger } from 'redux-logger';
import { logger } from '@shopgate/pwa-core';

export default createLogger({
  logger,
  collapsed: true,
  duration: true,
});
