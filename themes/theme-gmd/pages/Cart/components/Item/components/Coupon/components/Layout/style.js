import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const item = css({
  fontSize: '0.875rem',
  padding: `${variables.gap.small / 2}px ${variables.gap.big}px`,
}).toString();

const icon = css({
  fontSize: '3rem',
  flexShrink: 0,
  margin: '5px 12px 0 12px',
}).toString();

const content = css({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: variables.gap.big,
  paddingTop: variables.gap.small,
  paddingBottom: variables.gap.small,
}).toString();

const contentLast = css({
  alignItems: 'flex-end',
}).toString();

export default {
  item,
  icon,
  content,
  contentLast,
};
