import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap } = {}, colors = {} } = themeConfig;

export const container = css({
  fontSize: '0.875rem',
  padding: `0 ${gap.big}px ${gap.big}px`,
  marginBottom: gap.small * 1.5,
});

export const containerDense = css(container, {
  padding: 0,
  marginBottom: 0,
});

export const groupsContainer = css({
  borderBottom: `3px solid ${colors.background}`,
  marginBottom: gap.small * 1.5,
});

export const label = css({
  paddingBottom: (gap.small * 1.5),
});

export const tableCell = css({
  maxWidth: 100,
  padding: `${gap.xsmall * 0.5}px ${gap.small}px`,
  overflowWrap: 'break-word',
  ':first-of-type': {
    paddingLeft: 0,
  },
  ':last-of-type': {
    paddingRight: 0,
  },
});

export const accordion = css({
  borderTop: `3px solid ${colors.background}`,
});

export const subgroup = css({
  paddingTop: gap.small,
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
});
