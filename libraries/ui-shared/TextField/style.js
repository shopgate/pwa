import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
/**
 * The styles for the container element.
 */
const container = {
  input: css({
    position: 'relative',
    paddingBottom: themeConfig.variables.gap.big,
    width: '100%',
  }).toString(),
  multiLine: css({
    position: 'relative',
    width: '100%',
  }).toString(),
};

export default {
  container,
};
