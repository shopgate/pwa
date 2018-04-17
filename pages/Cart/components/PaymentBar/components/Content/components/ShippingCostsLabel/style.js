import { css } from 'glamor';
import colors from 'Styles/colors';

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const shippingInfoBase = {
  fontSize: '0.875rem',
  color: colors.shade9,
};

const shippingInfo = css({
  ...shippingInfoBase,
  display: 'flex',
  flexDirection: 'row',
}).toString();

export default {
  disabled,
  shippingInfo,
};
