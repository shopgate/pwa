import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const container = css({
  backgroundColor: themeColors.lightOverlay,
  height: '100vh',
  textAlign: 'center',
  padding: '30px',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
}).toString();

const title = css({
  fontWeight: 'bold',
  fontSize: '1.35rem',
  paddingTop: '30px',
  paddingBottom: '30px',
}).toString();

const item = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}).toString();

const link = css({
  paddingTop: '30px',
  textAlign: 'center',
  color: themeColors.gray,
}).toString();

const image = css({
  width: '80%',
}).toString();

const button = css({
  marginTop: '30px',
}).toString();

const buttonText = css({
  color: themeColors.gray,
}).toString();

export default {
  container,
  item,
  title,
  link,
  image,
  button,
  buttonText,
};
