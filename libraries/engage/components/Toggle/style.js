import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  textAlign: 'left',
  marginBottom: '25px',
  justifyContent: 'space-between',
}).toString();

const title = css({
  fontWeight: 'bold',
  display: 'block',
}).toString();

const toggleButton = css({
  display: 'inline-block',
  width: '40px',
  height: '20px',
  backgroundColor: '#ccc',
  borderRadius: '10px',
  position: 'relative',
  cursor: 'pointer',
  marginLeft: '32px',
  ':before': {
    content: '""',
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '16px',
    height: '16px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'transform 0.3s',
  },
}).toString();

const disabled = css({
  backgroundColor: themeConfig.colors.shade7,
}).toString();

const input = css({
  display: 'none',
  [`:checked + .${toggleButton}`]: {
    backgroundColor: themeConfig.colors.accent,
  },
  [`:checked + .${toggleButton}::before`]: {
    transform: 'translateX(20px)',
  },
}).toString();

const button = css({
  marginTop: '30px',
}).toString();

export default {
  input,
  toggleButton,
  title,
  container,
  button,
  disabled,
};
