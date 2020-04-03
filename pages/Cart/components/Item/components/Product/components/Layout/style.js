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
  // TODO: use resolutions from config here later
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

const priceInfo = css({
  textAlign: 'right',
  wordBreak: 'break-word',
}).toString();

const disclaimerSpacer = css({
  width: 10,
}).toString();

const price = css({
  marginLeft: '1em',
  alignSelf: 'flex-end',
}).toString();

const properties = css({
  wordBreak: 'break-word',
  alignSelf: 'flex-start',
  /**
   * When the properties column has content, apply a max width to the price column
   * to avoid issues with long availability texts.
   */
  [`:not(:empty) + .${price}`]: {
    maxWidth: '40%',
  },
}).toString();

export default {
  item,
  leftColumn,
  image,
  content,
  info,
  disclaimerSpacer,
  priceInfo,
  price,
  properties,
};
