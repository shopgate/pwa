import { componentsConfig as config } from '../config';
import collection from './portalCollection';
import { APP_ROUTES } from '../../constants/Portals';

const portals = collection.getPortals();

const routes = Object.keys(config.portals).map((component) => {
  if (config.portals[component].target !== APP_ROUTES) {
    return null;
  }
  return portals[component]();
}).filter(Boolean);

export default routes;
