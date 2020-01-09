import AppCommand from '../classes/AppCommand';
import { logger } from '../helpers';

/**
 * Enables the geofencing provider plotProjects
 * @param {string} token The public token that is needed to enable plot projects
 */
export function plotProjectsEnable(token) {
  const command = new AppCommand();

  command
    .setCommandName('plotProjectsEnable')
    .setLibVersion('18.0')
    .dispatch({
      publicToken: token,
    });
}

/**
 * Disables the geofencing provider plotProjects
 */
export function plotProjectsDisable() {
  const command = new AppCommand();

  command
    .setCommandName('plotProjectsDisable')
    .setLibVersion('18.0')
    .dispatch();
}

/**
 * This command sets a Segmentation Properties within PlotProjects
 * @param {Array} inputProperties Array that contains the information about the segmentation
 *                properties
 * @param {string} inputProperties.key The key of the property that shall be set.
 * @param {string} [inputProperties.type] The type of the value.
 *                 if <Null> or omitted, the default is string.
 *                 In case there is sent an unknown type, the property will be ignored.
 *                 In case the type doesn't fit to value at all.
 * @param {any} [inputProperties.value] The value that shall be set for that property. In case the
 *              value is <Null> or omitted, the property will be cleared. Only supported for strings
 * @return {boolean|undefined}
 */
export function plotProjectsSetSegmentationProperties(inputProperties) {
  const possibleTypes = [
    'string',
    'integer',
    'double',
    'date',
    'bool',
    null,
  ];

  // validate properties
  const properties = inputProperties.filter(({ key, type, value }) => {
    if (typeof key !== 'string') {
      logger.error(`Unsupported plotprojects property "key". found "${key}" (typeof "${typeof key}") expected "string"`);
      return false;
    }

    // plotProjects only allows max 40 characters as key
    if (key.length > 40) {
      logger.error('plotprojects property "key" exceeded length limit of 40');
      return false;
    }

    if (typeof value === 'string' && value.length > 40) {
      logger.error('plotprojects property "value" exceeded length limit of 40');
      return false;
    }

    if (typeof type !== 'undefined' && !possibleTypes.includes(type)) {
      logger.error(`Unsupported plotprojects property "type". found "${type}" expected:`, possibleTypes);
      return false;
    }

    // clear is only supported for strings at the moment
    if (typeof type !== 'string' && (value === null || typeof value === 'undefined')) {
      logger.error(`plotprojects. Clearing is only supported for type=string. found "${value}" for type "${type}"`);
      return false;
    }

    return true;
  });

  if (!properties.length) {
    logger.error('No valid plotprojects properties found', inputProperties);
    return false;
  }

  const command = new AppCommand();

  return command
    .setCommandName('plotProjectsSetSegmentationProperties')
    .setCommandParams({ properties })
    .setLibVersion('25.0')
    .dispatch();
}
