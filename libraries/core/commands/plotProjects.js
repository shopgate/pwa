import AppCommand from '../classes/AppCommand';

/**
 * Enables the geofencing provider plotProjects
 * @param {string} token The public token that is needed to enable plot projects
 */
export const plotProjectsEnable = (token) => {
  const command = new AppCommand();

  command
    .setCommandName('plotProjectsEnable')
    .setLibVersion('18.0')
    .dispatch({
      publicToken: token,
    });
};

/**
 * Disables the geofencing provider plotProjects
 */
export const plotProjectsDisable = () => {
  const command = new AppCommand();

  command
    .setCommandName('plotProjectsDisable')
    .setLibVersion('18.0')
    .dispatch();
};
