import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  marginBottom: 4,
  paddingLeft: 16,
  paddingRight: 16,
}).toString();

const inputWrapper = css({
  position: 'relative',
  flexGrow: 1,
}).toString();

const input = css({
  borderRadius: 10,
  width: '100%',
  padding: '4px 10px 4px 30px',
  lineHeight: '28px',
  outline: 'none',
  background: themeColors.shade7,
  verticalAlign: 'middle',
  WebkitAppearance: 'none',
}).toString();

const label = css({
  alignItems: 'center',
  color: themeColors.shade3,
  display: 'flex',
  height: '36px',
  position: 'absolute',
  pointerEvents: 'none',
  width: '100%',
}).toString();

const icon = css({
  padding: '0 6px',
  color: themeColors.shade3,
  fontSize: '1.235rem',
}).toString();

const searchBarWrapper = css({});

export default {
  container,
  inputWrapper,
  input,
  label,
  icon,
  searchBarWrapper,
};
