import { css } from 'glamor';
import classNames from 'classnames';
import radioGroupStyles from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item/style';

export const container = css({
  padding: '13px 16px 16px',
}).toString();

export const title = css({
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 8,
}).toString();

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
