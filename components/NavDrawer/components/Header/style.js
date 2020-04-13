import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  color: `var(--color-secondary-contrast, ${colors.accentContrast})`,
  marginBottom: 4,
}).toString();

const loggedIn = css({
  background: `var(--color-secondary, ${colors.accent})`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: variables.navigator.height,
  padding: `${variables.gap.small + 1}px ${variables.gap.big}px ${variables.gap.small - 1}px`,
  paddingTop: `calc(${variables.gap.small + 1}px + var(--safe-area-inset-top))`,
}).toString();

const ellipsis = {
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const welcome = css({
  fontSize: 16,
  fontWeight: 500,
  ...ellipsis,
}).toString();

const mail = css({
  ...ellipsis,
}).toString();

export default {
  container,
  loggedIn,
  welcome,
  mail,
};
