import { css } from 'glamor';
import classNames from 'classnames';
import radioGroupStyles from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item/style';
import { themeConfig } from '@shopgate/engage/core';

const { variables: { gap: { big: bigGap = 16 } = {} } = {} } = themeConfig;

export const container = css({
  padding: `${(bigGap * 0.8).toFixed()}px ${bigGap}px ${bigGap}px`,
});

export const title = css({
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: 8,
});

export const radioGroup = css({
  // Removes the vertical padding, which are applied by default around radio groups
  paddingTop: 0,
  paddingBottom: 0,
}).toString();

export const radioItem = css({
  overflow: 'hidden',
  whiteSpace: 'pre',
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
