import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const cardsWrapper = css({
  padding: '16px 0px 0px',
}).toString();

const card = css({
  padding: '0px 10px',
}).toString();

const pane = {
  width: '50%',
  position: 'relative',
  background: colors.light,
};

const discountBadge = css({
  width: 'auto',
  fontWeight: 400,
  marginBottom: variables.gap.small,
  borderRadius: 3,
}).toString();

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
  textAlign: 'right',
  marginTop: variables.gap.small,
}).toString();

const priceBase = css({
  padding: '0 15px',
}).toString();

const priceStriked = css({
  ...priceBase,
  fontSize: '0.8rem',
}).toString();

const price = css({
  ...priceBase,
  color: colors.primary,
  fontSize: '1.15rem',
  lineHeight: 1,
}).toString();

const cardInnerBox = css({
  borderRadius: variables.borderRadius.default,
}).toString();

const updateImageContainer = css({
  borderTopLeftRadius: variables.borderRadius.default,
  borderBottomLeftRadius: variables.borderRadius.default,
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

const bullets = css({
  textAlign: 'center',
}).toString();

const indicator = {
  bullets,
};

export default {
  card,
  discountBadge,
  imagePane,
  infoPane,
  indicator,
  priceGrid,
  priceStriked,
  price,
  cardsWrapper,
  cardTitle,
  timer,
  cardInnerBox,
  updateImageContainer,
};
