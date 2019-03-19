import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const container = css({
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  marginBottom: 4,
  paddingLeft: 20,
  paddingRight: 20,
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
  background: '#eaebed',
  verticalAlign: 'middle',
  WebkitAppearance: 'none',
}).toString();

const inputWithScannerIcon = css({
  paddingRight: 36,
}).toString();

const label = css({
  alignItems: 'center',
  color: '#8a8a8f',
  display: 'flex',
  height: '36px',
  position: 'absolute',
  pointerEvents: 'none',
  width: '100%',
}).toString();

const labelHidden = css({
  display: 'none',
}).toString();

const button = css({
  lineHeight: '36px',
  color: colors.accent,
  paddingTop: 0,
  paddingLeft: 20,
  paddingRight: 0,
  marginLeft: 0,
  marginRight: 0,
  verticalAlign: 'middle',
  outline: 0,
}).toString();

const hidden = css({
  display: 'none',
}).toString();

const icon = css({
  padding: '0 6px',
  color: '#8a8a8f',
  fontSize: '1.235rem',
}).toString();

const scannerIcon = css({
  padding: '4px 6px 4px 4px',
  color: '#8a8a8f',
  fontSize: '1.7rem',
  position: 'absolute',
  right: 0,
}).toString();

const overlay = css({
  background: 'rgba(0,0,0, 0.4)',
  position: 'absolute',
  left: 0,
  width: '100%',
  top: 124,
  bottom: 0,
  zIndex: 2,
  overflow: 'hidden',
  outline: 'none',
}).toString();

export default {
  container,
  inputWrapper,
  input,
  inputWithScannerIcon,
  label,
  labelHidden,
  hidden,
  button,
  icon,
  scannerIcon,
  overlay,
};
