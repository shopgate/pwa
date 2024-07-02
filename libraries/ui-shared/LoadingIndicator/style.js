import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

export const container = css({
  display: 'block',
  padding: '1em',
  textAlign: 'center',
  fontSize: '1.5em',
  color: `var(--color-secondary, ${colors.accent})`,
});

export const imgContainer = css({
  display: 'flex',
  justifyContent: 'center',
  ' img': {
    maxWidth: '50vw',
    maxHeight: '50vh',
  },
});
