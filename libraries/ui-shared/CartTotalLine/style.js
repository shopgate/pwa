import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const base = css({
  color: colors.shade9,
}).toString();

const subTotal = css({
  color: `${colors.dark}`,
}).toString();

const grandTotal = css({
  color: `${colors.dark}`,
  fontSize: '1rem !important',
}).toString();

const line = css({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.875rem',
}).toString();

export default {
  subTotal,
  grandTotal,
  base,
  line,
  disabled,
};
