import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const title = css({
  fontWeight: 500,
  lineHeight: 1.125,
  wordBreak: ['keep-all', 'break-word'],
  hyphens: 'auto',
}).toString();

const menuContainer = css({
  marginTop: `-${variables.gap.big}px`,
  marginRight: `-${variables.gap.big}px`,
}).toString();

const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

const menuToggleContainer = css({
  margin: variables.gap.small,
}).toString();

const menuToggleButton = css({
  height: menuToggleSize,
  width: menuToggleSize,
  fontSize: menuToggleFontSize,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}).toString();

export default {
  title,
  menuContainer,
  menuToggleContainer,
  menuToggleButton,
};
