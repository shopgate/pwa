import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const container = css({
  display: 'block',
  padding: '1em',
  textAlign: 'center',
  fontSize: '1.5em',
  color: themeConfig.colors.accent,
}).toString();

export default container;
