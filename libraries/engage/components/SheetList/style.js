import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const IMAGE_SPACE = 72;

const item = css({
  margin: `0 ${variables.gap.big}px`,
  cursor: 'pointer',
}).toString();

const itemNotLast = css({
  '&:not(:last-child)': {
    boxShadow: `0 1px 0 0 ${colors.darkGray}`,
    marginBottom: 1,
  },
}).toString();

const itemSelected = css({
  background: `var(--color-background-accent, ${colors.shade7})`,
  boxShadow: `-${variables.gap.bigger}px 0 0 var(--color-background-accent, ${colors.shade7}), ${variables.gap.bigger}px 0 0 var(--color-background-accent, ${colors.shade7})`,
  marginTop: -1,
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
  itemSelected,
  itemWithImage,
  innerContainer,
};
