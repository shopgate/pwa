import { css } from 'glamor';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

export const IMAGE_SPACE = 72;

const item = css({
  margin: `0 ${variables.gap.big}px`,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    boxShadow: 'none !important',
    padding: `${variables.gap.small}px 0`,
    '&:first-child': {
      paddingTop: 0,
    },
    '&:last-child': {
      paddingBottom: 0,
    },
  },
}).toString();

const itemNotLast = css({
  '&:not(:last-child)': {
    boxShadow: `0 1px 0 0 ${colors.darkGray}`,
    marginBottom: 1,
  },
}).toString();

const itemSelected = css({
  background: colors.shade7,
  boxShadow: `-${variables.gap.bigger}px 0 0 ${colors.shade7}, ${variables.gap.bigger}px 0 0 ${colors.shade7}`,
  marginTop: -1,
}).toString();

const itemWithImage = css({
  marginLeft: IMAGE_SPACE,
}).toString();

const innerContainer = css({
  minHeight: 56,
  position: 'relative',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    border: `1px solid ${colors.shade7}`,
  },
}).toString();

export default {
  item,
  itemNotLast,
  itemSelected,
  itemWithImage,
  innerContainer,
};
