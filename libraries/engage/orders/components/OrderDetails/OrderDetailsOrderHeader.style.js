import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const wrapper = css({
  padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
});

export const instructions = css({

});

export const body = css({
  border: 0,
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  marginBottom: 0,
});

export const orderNum = css({
  padding: 0,
  fontSize: '1.25rem',
  fontWeight: 500,
  lineHeight: '1.5rem',
  margin: `0 0 ${variables.gap.big}px`,
  border: 0,
});

export const subline = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

export const cancel = css({
  flexGrow: 1,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'flex-end',
});
