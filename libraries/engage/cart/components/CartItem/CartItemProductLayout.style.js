import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables, colors } = themeConfig;

const leftColumnWidth = 72;

const item = css({
  padding: variables.gap.big,
  /** Row is DOM reversed for a11y navigation */
  flexDirection: 'row-reverse',
}).toString();

const leftColumn = css({
  width: leftColumnWidth,
}).toString();

const image = css({
  background: colors.placeholder,
  marginBottom: variables.gap.small * 1.25,
  height: leftColumnWidth,
  width: leftColumnWidth,
}).toString();

const content = css({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: variables.gap.big,
}).toString();

const info = css({
  fontSize: '0.875rem',
  marginTop: variables.gap.big * 0.875,
  marginBottom: variables.gap.small * 0.25,
  flexGrow: 1,
  alignItems: 'flex-end',
  justifyContent: 'space-between',
}).toString();

const infoPriceLine = css({
  marginTop: 0,
}).toString();

const priceInfo = css({
  textAlign: 'right',
  wordBreak: 'break-word',
}).toString();

const disclaimerSpacer = css({
  width: 10,
}).toString();

export const priceLabel = css({
  color: `var(--color-text-low-emphasis, ${colors.shade9})`,
});

const price = css({
  display: 'flex',
  marginLeft: '1em',
  alignItems: 'flex-end',
  flexDirection: 'column',
}).toString();

const properties = css({
  wordBreak: 'break-word',
  alignSelf: 'flex-start',
  fontSize: '0.875rem',
  color: `var(--color-text-low-emphasis, ${colors.shade9})`,
  lineHeight: 1.3,
  /**
   * When the properties column has content, apply a max width to the price column
   * to avoid issues with long availability texts.
   */
  [`:not(:empty) + .${price}`]: {
    textAlign: 'right',
    maxWidth: '40%',
  },
}).toString();

const itemInactive = css({
  ' *': {
    color: 'var(--color-text-low-emphasis) !important',
  },
  [` .${image}`]: {
    opacity: 0.7,
  },
}).toString();

const orderDetailsSubtotalLabel = css({
  color: `var(--color-text-low-emphasis, ${colors.shade9})`,
}).toString();

export default {
  item,
  itemInactive,
  leftColumn,
  image,
  content,
  info,
  infoPriceLine,
  disclaimerSpacer,
  priceInfo,
  price,
  properties,
  orderDetailsSubtotalLabel,
};
