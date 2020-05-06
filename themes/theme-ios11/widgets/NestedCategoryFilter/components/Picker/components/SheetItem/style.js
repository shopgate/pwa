import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const button = css({
  outline: 0,
  padding: '16px 16px 16px 0',
  textAlign: 'left',
  width: '100%',
  color: 'var(--color-text-high-emphasis)',
});

const bgColor = colors.darkGray;
const boxShadowOffset = variables.gap.bigger;

const buttonSelected = css(button, {
  background: `var(--color-background-accent, ${bgColor})`,
  boxShadow: `-${boxShadowOffset}px 0 0 var(--color-background-accent, ${bgColor}), ${boxShadowOffset}px 0 0 $var(--color-background-accent, ${bgColor})`,
  margin: '-1px 0',
  paddingTop: 17,
  paddingBottom: 17,
});

export default {
  button,
  buttonSelected,
};
