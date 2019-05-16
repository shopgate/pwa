import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { IMAGE_SPACE } from '../../style';

const { colors, variables } = themeConfig;

const disabled = css({
  color: colors.shade5,
}).toString();

const selected = css({
  background: colors.shade7,
  boxShadow: `-16px 0 0 0 ${colors.shade7} !important`,
}).toString();

const title = css({
  width: '100%',
  marginTop: variables.gap.xsmall,
  paddingRight: 16,
  hyphens: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
}).toString();

const grid = css({
  alignItems: 'center',
  minHeight: 56,
  padding: `${variables.gap.small}px 0`,
  position: 'relative',
  zIndex: 2,
}).toString();

const image = css({
  alignSelf: 'flex-start',
  flexShrink: 0,
  margin: `0 ${variables.gap.big}px 0 ${-IMAGE_SPACE + variables.gap.big}px`,
  width: 40,
}).toString();

export default {
  disabled,
  selected,
  title,
  grid,
  image,
};
