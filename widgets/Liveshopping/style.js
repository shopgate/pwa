/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
}).toString();

const priceWrapper = css({
  position: 'absolute',
  left: 15,
  bottom: 15,
  right: 15,
}).toString();

const priceGrid = css({
  alignItems: 'flex-end',
}).toString();

const priceStrikedItem = css({
  flexGrow: 1,
}).toString();

const priceItem = css({
  flexGrow: 1,
  textAlign: 'right',
}).toString();

const priceBase = css({
  padding: '0 15px',
}).toString();

const priceStriked = css({
  ...priceBase,
  fontSize: '0.875rem',
}).toString();

const price = css({
  ...priceBase,
  color: colors.primary,
  fontSize: '1.25rem',
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

const indicator = css({
  position: 'relative',
  left: 0,
  bottom: 0,
  transform: 'translateX(0)',
  textAlign: 'center',
}).toString();

export default {
  card,
  discountBadge,
  imagePane,
  infoPane,
  indicator,
  priceWrapper,
  priceGrid,
  priceStrikedItem,
  priceItem,
  priceStriked,
  price,
  cardsWrapper,
  cardTitle,
  timer,
};
