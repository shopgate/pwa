import { createLogger } from 'redux-logger';
import { logger } from '@shopgate/pwa-core/helpers';

export default createLogger({
  logger,
  collapsed: true,
  duration: true,
});
