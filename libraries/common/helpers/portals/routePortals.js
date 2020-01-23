import { componentsConfig } from '../config';
import collection from './portalCollection';
import { APP_ROUTES } from '../../constants/Portals';

const portals = collection.getPortals();
const config = collection.getConfig() || componentsConfig.portals;

const routes = Object.keys(config).map((component) => {
  if (config[component].target !== APP_ROUTES) {
    return null;
  }
  return portals[component]();
}).filter(Boolean);

export default routes;
