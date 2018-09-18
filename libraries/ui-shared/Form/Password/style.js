import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const visOff = css({
  color: colors.shade4,
}).toString();

export default {
  visOff,
};
