import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const iconSize = 24;

const wrapper = css({
  position: 'relative',
  top: -35,
  right: -16,
}).toString();

const buttons = css({
  position: 'absolute',
  right: variables.gap.big,
  top: -20,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}).toString();

const favButton = css({
  zIndex: 1, // Prevents the icons to be visible outside of the circle
  fontSize: iconSize,
}).toString();

const ripple = css({
  padding: 8,
}).toString();

export default {
  wrapper,
  buttons,
  favButton,
  iconSize,
  ripple,
};
