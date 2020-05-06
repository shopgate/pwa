import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const row = css({
  marginBottom: variables.gap.small,
}).toString();

const wrapper = css({
  backgroundColor: `var(--color-background-accent, ${colors.shade8})`,
  padding: `${variables.gap.small}px ${variables.gap.big}px`,
  minHeight: 56,
}).toString();

const element = css({
  paddingBottom: 0,
  '& label': {
    fontWeight: 400,
    color: 'var(--color-text-low-emphasis, inherit)',
  },
  '& input': {
    fontWeight: 500,
    color: 'var(--color-text-high-emphasis)',
  },
  '& .placeholder': {
    color: 'var(--color-text-low-emphasis)',
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
