import { css } from 'glamor';

const button = css({
  marginTop: '30px',
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

export default {
  button,
  container,
  buttonWrapper,
};
