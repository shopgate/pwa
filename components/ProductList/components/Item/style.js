/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

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
  div: {
    marginBottom: 4,
  },
}).toString();

const priceContainer = css({
  ...containerPaddingSidewards,
  lineHeight: 1.35,
  textAlign: 'right',
  div: {
    marginBottom: 4,
  },
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
