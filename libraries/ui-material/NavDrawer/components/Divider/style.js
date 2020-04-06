import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

export default css({
  // prevent two consecutive dividers
  ' + hr': {
    display: 'none',
  },
  background: themeColors.darkGray,
  border: 0,
  height: 1,
  margin: '16px 0',
});
