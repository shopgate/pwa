import { css } from 'glamor';
import classNames from 'classnames';
import radioGroupStyles from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item/style';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap: { big: bigGap = 16 } = {} } = {} } = themeConfig;

export const container = css({
  padding: `${(bigGap * 0.8).toFixed()}px ${bigGap}px ${bigGap}px`,
});

export const title = css({
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: 8,
});

const radioBase = css({
  // Removes the vertical padding, which are applied by default around radio groups
  paddingTop: 0,
  paddingBottom: 0,
  transition: 'opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
});

export const radioGroup = radioBase.toString();

export const radioGroupDisabled = css(radioBase, {
  opacity: 0.25,
  pointerEvents: 'none',
}).toString();

export const radioItemLabelSpacer = css({
  whiteSpace: 'pre',
}).toString();

export const radioGroupItemLabel = classNames(radioGroupStyles.label, css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'baseline',
}).toString());

export const radioItemLabel = css({
  fontSize: '0.875rem',
}).toString();

export const pickUpGroupContainer = css({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'right',
});
