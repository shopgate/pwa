import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

export const chevronButton = css({
  flexShrink: 0,
  outline: 0,
  margin: `0 -${variables.gap.big}px 0 ${variables.gap.small}px`,
  fontSize: '1.6em',
  color: '#373D41',
  position: 'relative',

});

export const chevron = css({
  transformOrigin: 'center center',
  transition: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
});

export const chevronDown = css(chevron, {
  transform: 'rotateZ(0deg)',
});

export const chevronUp = css(chevron, {
  transform: 'rotateZ(180deg)',
});

export const progressBar = css({
  position: 'absolute',
  overflow: 'hidden',
  width: '100%',
  bottom: 0,
  height: 3,
});

export const open = css({
//  borderRight: '2px solid var(--color-primary)',
}).toString();

export const loadingIndicator = css({
  position: 'absolute',
  padding: 0,
  top: '50%',
  marginTop: '-50%',
  paddingTop: 1,
  right: 3,
}).toString();
