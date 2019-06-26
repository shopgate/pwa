import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const button = css({
  outline: 0,
  padding: '16px 16px 16px 0',
  textAlign: 'left',
  width: '100%',
});

const buttonDisabled = css(button, {
  color: colors.shade4,
});

const buttonSelected = css(button, {
  background: colors.darkGray,
  boxShadow: `-16px 0 0 ${colors.darkGray}, 16px 0 0 ${colors.darkGray}`,
  margin: '-1px 0',
  paddingTop: 17,
  paddingBottom: 17,
});

export default {
  button,
  buttonDisabled,
  buttonSelected,
};
