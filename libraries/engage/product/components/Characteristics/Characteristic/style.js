import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const button = css({
  background: themeColors.overlay,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 56,
  outline: 0,
  padding: '12px 16px',
  marginBottom: 8,
  transition: 'background 250ms ease-in, color 250ms ease-in',
}).toString();

const buttonDisabled = css({
  color: themeColors.shade4,
}).toString();

const label = css({
  fontSize: 12,
  marginTop: -2,
  marginBottom: 4,
}).toString();

const selection = css({
  fontWeight: 500,
  lineHeight: 1.125,
}).toString();

export default {
  button,
  buttonDisabled,
  label,
  selection,
};
