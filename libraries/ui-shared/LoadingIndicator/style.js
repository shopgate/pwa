import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const container = css({
  display: 'block',
  padding: '1em',
  textAlign: 'center',
  fontSize: '1.5em',
  color: `var(--color-secondary, ${colors.accent})`,
}).toString();

export const imgContainer = css({
  display: 'flex',
  justifyContent: 'center',
  ' img': {
    maxWidth: '50vw',
    maxHeight: '50vh',
  },
}).toString();
export default container;
