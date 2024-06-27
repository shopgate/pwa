import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'flex',
  flex: 1,
  textAlign: 'left',
  justifyContent: 'space-between',
  flexDirection: 'row-reverse',
  gap: '32px',
});

const input = css({
  display: 'flex',
  flexShrink: 0,
  appearance: 'none',
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
  ':checked': {
    backgroundColor: themeConfig.colors.accent,
  },
  ':checked::before': {
    transform: 'translateX(20px)',
  },
  ':disabled': {
    backgroundColor: themeConfig.colors.shade7,
    cursor: 'not-allowed',
  },
});

export default {
  container,
  input,
};
