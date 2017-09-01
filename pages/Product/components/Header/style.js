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

const manufacturer = css({
  fontSize: '1.0rem',
}).toString();

const priceInfo = css({
  fontSize: '0.625rem',
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
  priceInfo,
  infoContainer,
  priceContainer,
  basePriceContainer,
  placeholder,
};
