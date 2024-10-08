import { css } from 'glamor';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const modalContent = css({
  width: '100%',
}).toString();

const modalLayout = css({
  backgroundColor: themeColors.lightOverlay,
}).toString();

const container = css({
  backgroundColor: themeColors.lightOverlay,
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
  maxWidth: 400,
}).toString();

const button = css({
  marginTop: '30px',
}).toString();

const buttonText = css({
  color: themeColors.gray,
}).toString();

export default {
  modalContent,
  modalLayout,
  container,
  item,
  title,
  link,
  image,
  button,
  buttonText,
};
