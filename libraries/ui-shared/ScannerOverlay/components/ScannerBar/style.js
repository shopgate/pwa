import { css } from 'glamor';
import { themeShadows, themeColors, themeVariables } from '@shopgate/pwa-common/helpers/config';

const container = css({
  bottom: 0,
  backgroundColor: themeColors.overlay,
  boxShadow: themeShadows.scannerBar,
  fontSize: 14,
  alignItems: 'center',
}).toString();

const column = css({
  margin: `${themeVariables.gap.big}px`,
  ':not(:first-child)': {
    marginLeft: 0,
  },
}).toString();

export default {
  container,
  column,
};

