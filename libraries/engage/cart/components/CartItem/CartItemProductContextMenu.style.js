import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const menuContainer = css({
  marginTop: `-${variables.gap.big}px`,
  marginRight: `-${variables.gap.big}px`,
}).toString();

const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

export const menuToggleContainer = css({
  margin: variables.gap.small,
}).toString();

export const menuToggleButton = css({
  height: menuToggleSize,
  width: menuToggleSize,
  fontSize: menuToggleFontSize,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}).toString();
