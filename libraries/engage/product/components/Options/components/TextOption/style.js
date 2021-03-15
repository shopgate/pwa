import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const row = css({
  marginBottom: variables.gap.small,
}).toString();

const wrapper = css({
  backgroundColor: colors.shade8,
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  minHeight: 56,
}).toString();

const element = css({
  paddingBottom: 0,
  '& label': {
    fontWeight: 400,
    color: 'inherit',
  },
  '& input': {
    fontWeight: 500,
  },
}).toString();

const infoIcon = css({
  color: colors.shade9,
}).toString();

export default {
  row,
  wrapper,
  element,
  infoIcon,
};
