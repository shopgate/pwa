import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const headline = css({
  fontSize: '1rem',
  fontWeight: 500,
  padding: `0 ${variables.gap.big}px ${variables.gap.small}px`,
  margin: 0,
});

export const sliderContainer = css({
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
  padding: `${variables.gap.small}px 0 ${variables.gap.big}px`,
}).toString();

export const card = css({
  height: '100%',
  margin: `0 ${variables.gap.small}px`,
}).toString();
