// @flow
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import radioGroupStyles from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item/style';

const { variables } = themeConfig;

export const container = css({
  padding: variables.gap.big,
});

export const radioItem = css({
  overflow: 'hidden',
  whiteSpace: 'pre',
});

export const itemLabel = classNames(radioGroupStyles.label, css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'baseline',
}).toString());

export const pickUpContainer = css({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'right',
});
