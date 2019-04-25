import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const IMAGE_SPACE = 72;

const item = css({
  marginLeft: variables.gap.big,
}).toString();

const itemNotLast = css({
  boxShadow: `0 1px 0 0 ${colors.darkGray}`,
  marginBottom: 1,
}).toString();

const itemWithImage = css({
  marginLeft: IMAGE_SPACE,
}).toString();

const innerContainer = css({
  minHeight: 56,
  position: 'relative',
}).toString();

export default {
  item,
  itemNotLast,
  itemWithImage,
  innerContainer,
};
