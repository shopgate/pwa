import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const headline = css({
  fontSize: '1rem',
  fontWeight: 500,
  padding: `0 ${variables.gap.big}px ${variables.gap.small}px`,
  margin: 0,
});
