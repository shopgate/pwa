import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const button = css({
  marginTop: '20px',
}).toString();

const container = css({
  flexDirection: 'column',
  height: '100vh',
  textAlign: 'center',
  padding: '30px',
  justifyContent: 'center',
  display: 'flex',
}).toString();

const buttonWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '30px',
}).toString();

const item = css({
  display: 'flex',
  flexDirection: 'column',
}).toString();

const link = css({
  color: themeColors.accent,
  textDecoration: 'underline',
}).toString();

const switchWrapper = css({
  marginBottom: '25px',
}).toString();

export default {
  button,
  container,
  buttonWrapper,
  link,
  item,
  switchWrapper,
};
