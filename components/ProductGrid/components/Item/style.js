import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const itemDetails = css({
  position: 'relative',
  flexGrow: 2,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    width: '66%',
  },
});

export const itemImage = css({
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    width: '33%',
  },
}).toString();

export default css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  background: colors.light,
  fontSize: 14,
  height: '100%',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    flexDirection: 'row-reverse',
    border: `1px solid ${colors.shade7}`,
  },
}).toString();
