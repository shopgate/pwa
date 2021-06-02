import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const container = css({
  paddingTop: 60,
}).toString();

const widgetWrapper = css({
  background: colors.shade8,
}).toString();

export default {
  container,
  widgetWrapper,
};
