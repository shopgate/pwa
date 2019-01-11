import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const wrapper = css({
  padding: '0px 10px',
});

const pane = {
  width: '50%',
  background: colors.light,
};

const imagePane = css({
  ...pane,
}).toString();

const infoPane = css({
  ...pane,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}).toString();

const priceGrid = css({
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginTop: variables.gap.small,
}).toString();

const priceStriked = css({
  fontSize: '0.875rem',
}).toString();

const price = css({
  color: colors.primary,
  fontSize: '1.25rem',
  lineHeight: 1,
}).toString();

const cardTitle = css({
  fontWeight: 500,
  lineHeight: 1.25,
  marginBottom: variables.gap.small * 0.5,
}).toString();

const timer = css({
  fontSize: '0.875rem',
  color: colors.primary,
  fontStyle: 'italic',
  fontWeight: 500,
}).toString();

export default {
  wrapper,
  imagePane,
  infoPane,
  priceGrid,
  priceStriked,
  price,
  cardTitle,
  timer,
};
