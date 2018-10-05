import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';
import { physicalPixelSize } from '@shopgate/pwa-common/helpers/style';

const leftColumnWidth = 72;

const item = css({
  padding: variables.gap.big,
  position: 'relative',
  ':after': {
    content: '""',
    position: 'absolute',
    right: variables.gap.big,
    bottom: 0,
    left: variables.gap.big,
    background: colors.dividers,
    ...physicalPixelSize('height', 1),
  },
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

const disclaimerSpacer = css({
  width: 10,
}).toString();

const priceInfo = css({
  textAlign: 'right',
}).toString();

export default {
  item,
  leftColumn,
  image,
  content,
  info,
  disclaimerSpacer,
  priceInfo,
};
