import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { variables } = themeConfig;

const menuToggleSize = variables.gap.big * 2;
const menuToggleFontSize = variables.gap.big * 1.5;

export const menuToggleContainer = css({
  margin: variables.gap.small,
  [responsiveMediaQuery('>sm', { webOnly: true })]: {
    marginLeft: 0,
  },
}).toString();

export const menuToggleButton = css({
  height: menuToggleSize,
  width: menuToggleSize,
  fontSize: menuToggleFontSize,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}).toString();
