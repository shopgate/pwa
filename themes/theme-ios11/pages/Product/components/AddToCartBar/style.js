import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const barHeight = 46;

const container = css({
  background: colors.light,
  boxShadow: '0 -4px 5px -2px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 2,
  overflow: 'hidden',
});

const innerContainer = css({
  padding: variables.gap.small,
});

const base = css({
  height: barHeight,
  position: 'relative',
});

const statusBar = css({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  maxWidth: '60%',
  padding: `0 ${variables.gap.small}px`,
});

export default {
  container,
  innerContainer,
  base,
  statusBar,
};
