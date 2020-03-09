// @flow
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import radioGroupStyles from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item/style';

const { variables, colors } = themeConfig;

export const container = css({
  padding: `0 ${variables.gap.big}px`,
});

export const radioGroup = css({
  // Removes the vertical padding, which are applied by default around radio groups
  paddingTop: 0,
  paddingBottom: 0,
  transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
}).toString();

export const radioItem = css({
  display: 'flex',
  alignItems: 'center',
  padding: `${variables.gap.big}px 0`,
  boxShadow: `0 1px 0 ${colors.darkGray}`,
}).toString();

export const itemLabel = classNames(radioGroupStyles.label, css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: 0,
}).toString());

export const pickUpContainer = css({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'right',
});
