import { themeConfig } from '../mock';

export { themeConfig };
export const themeColors = themeConfig.colors;
export const themeShadows = themeConfig.shadows;
export const themeVariables = themeConfig.variables;
export const themeIcons = themeConfig.icons;
export const themeName = 'gmd';

const appConfig = {
  get hideProductImageShadow() { return true; },
  get hasFavorites() { return true; },
  get language() { return 'de-de'; },
  get marketId() { return 'DE'; },
};

export default appConfig;
