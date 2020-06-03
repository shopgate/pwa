import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const container = css({
  paddingTop: 60,
}).toString();

const widgetWrapper = css({
  background: `var(--page-background-color, ${colors.shade8})`,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    paddingBottom: 16,
  },
}).toString();

export default {
  container,
  widgetWrapper,
};
