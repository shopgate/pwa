import AppCommand from '../classes/AppCommand';

/**
 * Sends an analyticsSetCustomValues command to the app.
 * @param {Object} params The command parameters
 * @param {Array} [params.customDimensions] Array of customDimensions
 * @param {Array} [params.customMetrics] Array of customMetrics
 */
export default function analyticsSetCustomValues(params) {
  const command = new AppCommand();

  command
    .setCommandName('analyticsSetCustomValues')
    .dispatch(params);
}
