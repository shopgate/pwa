import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { IMAGE_SPACE } from '../../style';

const { colors, variables } = themeConfig;

const disabled = css({
  color: colors.shade5,
  cursor: 'not-allowed',
}).toString();

const selected = css({
  background: `var(--color-background-accent, ${colors.shade7})`,
  boxShadow: `-16px 0 0 0 var(--color-background-accent, ${colors.shade7}) !important`,
}).toString();

const title = css({
  width: '100%',
  marginTop: variables.gap.xsmall,
  paddingRight: variables.gap.big,
  hyphens: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  color: 'var(--color-text-high-emphasis)',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: variables.gap.big,
    margin: 0,
    fontSize: '1.25rem',
    lineHeight: '1.5rem',
    fontWeight: 500,
  },
}).toString();

const description = css({
  display: 'none',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    display: 'block',
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 'initial',
    paddingTop: variables.gap.small,
  },
});

const grid = css({
  alignItems: 'center',
  minHeight: 56,
  padding: `${variables.gap.small}px 0`,
  position: 'relative',
  zIndex: 2,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: 0,
  },
}).toString();

const image = css({
  alignSelf: 'flex-start',
  flexShrink: 0,
  margin: `0 ${variables.gap.big}px 0 ${-IMAGE_SPACE + variables.gap.big}px`,
  width: 40,
}).toString();

const glowHover = {
  boxShadow: `-${variables.gap.bigger}px 0 0 ${colors.shade8}, ${variables.gap.bigger}px 0 0 ${colors.shade8}`,
};

export default {
  disabled,
  selected,
  title,
  description,
  grid,
  image,
  glowHover,
};
