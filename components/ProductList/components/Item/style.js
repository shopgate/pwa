import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors, variables } = themeConfig;

const elementPadding = variables.gap.big / 2;

const containerPaddingSidewards = {
  padding: elementPadding,
};

const listItemContainer = css({
  padding: elementPadding,
  background: colors.light,
}).toString();

const imageContainer = css({
  ...containerPaddingSidewards,
  width: 40,
  minHeight: 40,
  boxSizing: 'content-box',
}).toString();

const titleContainer = css({
  ...containerPaddingSidewards,
  lineHeight: 1.35,
  width: '50%',
}).toString();

const priceContainer = css({
  ...containerPaddingSidewards,
  lineHeight: 1.35,
  textAlign: 'right',
}).toString();

const favouriteContainer = css({
  display: 'none', // Hidden for now
  width: 40,
}).toString();

const availability = css({
  fontSize: '0.75rem',
}).toString();

const manufacturer = css({
  fontSize: '0.875rem',
}).toString();

const price = css({
  justifyContent: 'flex-end',
}).toString();

const priceStriked = css({
  fontSize: '0.875rem',
}).toString();

const priceInfo = css({
  fontSize: '0.75rem',
}).toString();

export default {
  listItemContainer,
  imageContainer,
  titleContainer,
  priceContainer,
  favouriteContainer,
  manufacturer,
  availability,
  price,
  priceStriked,
  priceInfo,
};
