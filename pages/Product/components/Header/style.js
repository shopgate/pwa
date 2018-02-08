/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
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

const price = css({
  justifyContent: 'flex-end',
}).toString();

const priceInfo = css({
  marginTop: 3,
  ':not(:last-child)': {
    marginBottom: 3,
  },
}).toString();

const productInfo = css({
  marginTop: `${variables.gap.small / 2}px`,
  ':not(:last-child)': {
    marginBottom: `${variables.gap.small / 2}px`,
  },
}).toString();

const priceContainer = css({
  textAlign: 'right',
  marginLeft: variables.gap.big,
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

const disclaimerSpacer = css({
  width: 10,
}).toString();

export default {
  content,
  productInfo,
  priceContainer,
  priceInfo,
  price,
  placeholder,
  disclaimerSpacer,
};
