import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const wrapper = css({
  paddingBottom: 'var(--safe-area-inset-bottom)',
}).toString();

const container = css({
  background: colors.light,
  boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
  padding: `${variables.gap.small}px`,
  lineHeight: 1.45,
  flexWrap: 'wrap',
  position: 'relative',
  flexDirection: 'column',
  zIndex: 2,
}).toString();

const checkoutButton = css({
  display: 'flex',
  justifyContent: 'flex-end',
}).toString();

const checkoutButtonContainer = css({
  background: colors.light,
  padding: `0 ${variables.gap.small}px 10px ${variables.gap.small}px`,
  position: 'relative',
  zIndex: 2,
}).toString();

export default {
  wrapper,
  container,
  checkoutButton,
  checkoutButtonContainer,
};
