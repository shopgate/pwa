import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const button = css({
  outline: 0,
  padding: '16px 16px 16px 0',
  textAlign: 'left',
  width: '100%',
  color: 'var(--color-text-high-emphasis)',
  cursor: 'pointer',
});

const boxShadowOffset = variables.gap.bigger;

const buttonSelected = css(button, {
  background: 'var(--color-background-accent)',
  boxShadow: `-${boxShadowOffset}px 0px 0px var(--color-background-accent), ${boxShadowOffset}px 0px 0px var(--color-background-accent)`,
  margin: '-1px 0',
  paddingTop: 17,
  paddingBottom: 17,
  cursor: 'not-allowed',
});

export default {
  button,
  buttonSelected,
};
