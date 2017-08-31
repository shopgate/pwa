/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const content = css({
  position: 'relative',
  backgroundColor: colors.light,
  padding: variables.gap.big,
  borderTop: 'rgba(0, 0, 0, 0.05) 2px solid',
}).toString();

const name = css({
  fontWeight: 'bold',
  fontSize: '1.25rem',
  lineHeight: '1.7rem',
  paddingTop: 2,
  marginRight: 72,
}).toString();

const manufacturer = css({
  fontSize: '1.0rem',
}).toString();

const shipping = css({
  fontSize: '0.875rem',
}).toString();

const availability = css({
  fontSize: '0.875rem',
}).toString();

const discount = css({
  width: 40,
  display: 'inline-block',
}).toString();

const price = css({
  fontSize: '1.25rem',
}).toString();

const priceInfo = css({
  fontSize: '0.625rem',
}).toString();

const msrp = css({
  color: colors.shade3,
  fontSize: '0.875rem',
  marginRight: variables.gap.small,
}).toString();

const msrpStriked = css({
  display: 'inline',
  fontSize: '0.875rem',
}).toString();

const infoContainer = css({
  width: '50%',
  alignSelf: 'flex-end',
}).toString();

const priceContainer = css({
  width: '50%',
  textAlign: 'right',
  alignSelf: 'flex-end',
}).toString();

const basePriceContainer = css({
  width: '50%',
  textAlign: 'right',
  alignSelf: 'flex-end',
  marginLeft: '50%',
}).toString();

const placeholder = {
  name: css({
    width: '70%',
    height: 24,
    marginTop: 5,
  }).toString(),
  info: css({
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  }).toString(),
  price: css({
    height: 20,
    width: '50px',
    display: 'inline-block',
  }).toString(),
};

export default {
  content,
  name,
  manufacturer,
  shipping,
  availability,
  discount,
  price,
  priceInfo,
  msrp,
  msrpStriked,
  infoContainer,
  priceContainer,
  basePriceContainer,
  placeholder,
};
