// @flow
import { css } from 'glamor';
import classNames from 'classnames';
import radioGroupStyles from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item/style';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap: { big: bigGap = 16 } = {} } = {} } = themeConfig;

export const labelContainer = classNames(radioGroupStyles.label, css({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignContent: 'stretch',
  alignItems: 'baseline',
}).toString());

export const label = css({
  paddingRight: bigGap,
  width: '50%',
  minWidth: '50%',
});
