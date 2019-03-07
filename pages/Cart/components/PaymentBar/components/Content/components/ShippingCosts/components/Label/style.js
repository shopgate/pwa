import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

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
  paddingRight: variables.gap.small,
}).toString();

export default {
  disabled,
  shippingInfo,
};
