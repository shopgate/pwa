import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';

export const container = css({
  [responsiveMediaQuery('<=sm', { appAlways: true })]: {
    paddingBottom: themeVariables.gap.small,
  },
});
