import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { IMAGE_SPACE } from '../../style';

const { colors, variables } = themeConfig;

const disabled = css({
  color: colors.shade5,
}).toString();

const bgColor = colors.darkGray;
const boxShadowOffset = variables.gap.bigger;

const selected = css({
  background: bgColor,
  boxShadow: `-${boxShadowOffset}px 0 0 ${bgColor}, ${boxShadowOffset}px 0 0 ${bgColor} !important`,
}).toString();

const title = css({
  width: '100%',
  marginTop: 2,
  paddingRight: 16,
  hyphens: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
}).toString();

const grid = css({
  alignItems: 'center',
  minHeight: 50,
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
