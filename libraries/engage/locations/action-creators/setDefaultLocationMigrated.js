import { MIGRATE_DEFAULT_LOCATION } from '../constants';

/**
 * Creates the dispatched MIGRATE_DEFAULT_LOCATION action object.
 * @returns {Object}
 */
const setDefaultLocationMigrated = () => ({
  type: MIGRATE_DEFAULT_LOCATION,
});

export default setDefaultLocationMigrated;
