import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const button = css({
  outline: 0,
  textAlign: 'left',
  paddingLeft: 0,
  paddingRight: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

const buttonDisabled = css(button, {
  color: colors.shade4,
});

const bgColor = colors.darkGray;
const boxShadowOffset = variables.gap.bigger;

const root = css({
  padding: '16px 0',
});

const rootSelected = css(root, {
  background: bgColor,
  boxShadow: `-${boxShadowOffset}px 0 0 ${bgColor}, ${boxShadowOffset}px 0 0 ${bgColor}`,
  paddingTop: 17,
  paddingBottom: 17,
  margin: '-1px 0',
}).toString();

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
    marginTop: 8,
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
