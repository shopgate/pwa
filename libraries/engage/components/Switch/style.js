import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  textAlign: 'left',
  justifyContent: 'space-between',
});

const switchButton = css({
  display: 'inline-block',
  width: '40px',
  height: '20px',
  backgroundColor: '#ccc',
  borderRadius: '10px',
  position: 'relative',
  cursor: 'pointer',
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
});

const input = css({
  display: 'none',
  [`:checked + .${switchButton}`]: {
    backgroundColor: themeConfig.colors.accent,
  },
  [`:disabled + .${switchButton}`]: {
    backgroundColor: themeConfig.colors.shade7,
  },
  [`:checked + .${switchButton}::before`]: {
    transform: 'translateX(20px)',
  },
});

const disabled = css({
  backgroundColor: themeConfig.colors.shade7,
  cursor: 'not-allowed',
});

export default {
  input,
  switchButton,
  container,
  disabled,
};
