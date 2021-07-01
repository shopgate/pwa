import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const label = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 56,
  outline: 0,
  padding: '12px 16px',
  transition: 'background 250ms ease-in, color 250ms ease-in',
  fontWeight: 500,
  lineHeight: 1.125,
}).toString();

const labelDisabled = css({
  color: colors.shade4,
}).toString();

const items = css({
  padding: '0 16px',
  marginBottom: 16,
}).toString();

export default {
  label,
  labelDisabled,
  items,
};
