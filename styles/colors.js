import { isObject } from '@shopgate/pwa-common/helpers/validation';
import { colors as customColors } from '../config/app';

let overrides = {};

if (isObject(customColors)) {
  overrides = {
    ...customColors,
  };
}

export default {
  background: '#f8f8f8',
  light: '#fff',
  dark: '#000',
  accent: '#5ccee3',
  placeholder: '#f2f2f2',
  primary: '#fa5400',
  darkGray: '#eaeaea',
  shade3: '#9a9a9a',
  shade4: '#b5b5b5',
  shade5: '#ccc',
  shade6: '#656565',
  shade7: '#eaeaea',
  shade8: '#f7f7f7',
  shade9: '#8d8d8d',
  shade10: '#f4f4f4',
  shade11: '#747474',
  success: '#35cc29',
  warning: '#ff9300',
  error: '#ff0000',
  ...overrides,
};
