import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const disabled = css({
  color: `${colors.shade4} !important`,
}).toString();

const label = css({
  fontSize: '0.875rem',
  color: colors.shade9,
  display: 'flex',
  flexDirection: 'row',
  paddingRight: variables.gap.small,
}).toString();

export default {
  disabled,
  label,
};
