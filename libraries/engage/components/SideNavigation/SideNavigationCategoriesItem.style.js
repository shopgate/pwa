import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const chevronButton = css({
  flexShrink: 0,
  outline: 0,
  marginLeft: variables.gap.big,
  fontSize: '1.5em',
  padding: `${variables.gap.big}px 0`,
});

export const chevronDown = css({
  transform: 'rotateZ(-90deg)',
});

export const chevronUp = css({
  transform: 'rotateZ(90deg)',
});

export const progressBar = css({
  position: 'relative',
});
