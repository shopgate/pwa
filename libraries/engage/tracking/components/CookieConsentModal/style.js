import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const modalContent = css({
  width: '100%',
}).toString();

const container = css({
  backgroundColor: themeColors.lightOverlay,
  height: '100vh',
  padding: '30px',
  paddingTop: 'calc(30px + var(--safe-area-inset-top))',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
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
  color: themeColors.accent,
  textDecoration: 'underline',
}).toString();

const image = css({
  width: '80%',
  maxWidth: 400,
}).toString();

const button = css({
  marginTop: '30px',
}).toString();

const buttonText = css({
  color: themeColors.gray,
}).toString();

const buttonWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '30px',
  width: '100%',
}).toString();

export default {
  modalContent,
  container,
  item,
  title,
  link,
  image,
  button,
  buttonText,
  buttonWrapper,
};
