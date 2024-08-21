import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';

const { colors } = themeConfig;

const button = css({
  outline: 0,
  textAlign: 'left',
  paddingLeft: 0,
  paddingRight: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  color: 'var(--color-text-high-emphasis)',
});

const buttonDisabled = css(button, {
  color: colors.shade4,
});

const root = css({
  padding: '16px 0',
  [responsiveMediaQuery('>xs', { webOnly: true })]: {
    padding: '8px 16px',
  },
});

const rootSelected = css(button, {
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

const mainRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px 8px',
  justifyContent: 'space-between',
  width: '100%',
}).toString();

const mainRowRight = css({
  marginLeft: 'auto',
}).toString();

const bottomRow = css({
  '&:not(:empty)': {
    textAlign: 'right',
  },
}).toString();

export default {
  root,
  rootSelected,
  button,
  buttonDisabled,
  mainRow,
  mainRowRight,
  bottomRow,
};
