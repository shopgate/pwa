import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const pdp = css({
  fontSize: '1rem',
}).toString();

const plp = css({
  fontSize: '0.75rem',
}).toString();
const slider = css({
  fontSize: '0.75rem',
}).toString();

const hint = css({
  color: colors.accent,
}).toString();

export default {
  hint,
  plp,
  pdp,
  slider,
};
