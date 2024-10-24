import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const container = css({
  background: colors.background,
  padding: `${variables.gap.big}px ${variables.gap.small * 1.5}px ${variables.gap.xxbig * 2}px`,
  boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
});

export const heading = css({
  fontSize: '1.125rem',
  fontWeight: 'bold',
  margin: `${variables.gap.small}px 0 ${variables.gap.bigger}px`,
});

export const body = css({
  padding: `${variables.gap.big}px 0 0`,
  margin: `0 0 ${variables.gap.bigger}px`,
  border: 0,
});

export const orderNum = css({
  padding: 0,
  fontSize: '1.1875rem',
  fontWeight: 'bold',
  margin: `0 0 ${variables.gap.big}px`,
  border: 0,
});
