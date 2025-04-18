import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export default css({
  marginTop: 4,
});

export const wideHeader = css({
  frontSize: ' 3rem',
});

export const wideHeaderMessagesWithItems = css({
  marginTop: variables.gap.big * -1,
}).toString();

export const headerContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
}).toString();

export const subscription = css({
  marginRight: 14,
}).toString();
