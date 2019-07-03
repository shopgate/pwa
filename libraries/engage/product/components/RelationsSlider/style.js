import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const container = css({
  position: 'relative',
});

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

export const gridCard = css({
  height: '100%',
  margin: 0,
}).toString();

export const showMore = css({
  position: 'absolute',
  display: 'block',
  padding: `${variables.gap.xsmall}px ${variables.gap.small * 1.5}px`,
  top: 0,
  right: variables.gap.big,
  fontSize: '0.875rem',
  lineHeight: 1.1,
  borderRadius: 4,
  border: `1px solid ${colors.shade5}`,
});

export const sheet = css({
  maxHeight: `calc(100vh - ${variables.navigator.height}px)`,
}).toString();

export const gridItem = css({
  ':nth-child(even)': {
    padding: '8px 0 8px 8px',
  },
  ':nth-child(odd)': {
    padding: '8px 8px 8px 0',
  },
  ':first-child': {
    padding: '0 8px 8px 0',
  },
  ':nth-child(2)': {
    padding: '0 0 8px 8px',
  },
  padding: 8,
  width: '50%',
}).toString();
