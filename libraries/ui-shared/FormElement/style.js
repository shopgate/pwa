import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The styles for the container element.
 */
const formElement = css({
  position: 'relative',
  paddingBottom: themeConfig.variables.gap.big,
  width: '100%',
}).toString();

export default {
  formElement,
};
