import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors } = themeConfig;

const button = css({
  outline: 0,
  padding: '16px 16px 16px 0',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: '8px 16px',
  },
  textAlign: 'left',
  width: '100%',
  color: 'var(--color-text-high-emphasis)',
});

const buttonDisabled = css(button, {
  color: colors.shade4,
});

const buttonSelected = css(button, {
  background: `var(--color-background-accent, ${colors.darkGray})`,
  boxShadow: `-16px 0 0 var(--color-background-accent, ${colors.darkGray}), 16px 0 0 var(--color-background-accent, ${colors.darkGray})`,
  margin: '-1px 0',
  paddingTop: 17,
  paddingBottom: 17,
  fontWeight: 500,
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    margin: 0,
    paddingTop: 8,
    paddingBottom: 8,
    padding: '8px 16px',
    boxShadow: 'none',
  },
});

export default {
  button,
  buttonDisabled,
  buttonSelected,
};
