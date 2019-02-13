import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const container = css({
  background: colors.light,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: variables.gap.big,
}).toString();

const buttonContainer = css({
  padding: `0 ${variables.gap.small}px`,
}).toString();

const button = css({
  width: '100%',
}).toString();

export default {
  container,
  buttonContainer,
  button,
};
