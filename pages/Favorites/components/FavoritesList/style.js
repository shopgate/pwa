/*
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from 'glamor';
import colors from 'Styles/colors';
import variables from 'Styles/variables';

const container = css({
  background: colors.background,
  flexGrow: 1,
  paddingTop: variables.gap.xsmall,
}).toString();

const image = css({
  width: '100%',
}).toString();

const row = css({
  padding: variables.gap.big,
  justifyContent: 'space-between',
}).toString();

const leftColumn = css({
  paddingRight: variables.gap.small,
  flexShrink: 0,
  flexGrow: 1,
  minWidth: 126,
  maxWidth: 200,
  width: '19%',
}).toString();

const rightColumn = css({
  paddingLeft: variables.gap.small,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}).toString();

const name = css({
  fontWeight: 500,
  lineHeight: 1.125,
  marginBottom: '1em',
}).toString();

const details = css({

}).toString();

const propertiesContainer = css({
  paddingRight: variables.gap.small,
  fontSize: 14,
}).toString();

const priceContainer = css({
  paddingLeft: variables.gap.small,
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  fontSize: 14,
}).toString();

const detailsRow = css({
  justifyContent: 'space-between',
  alignItems: 'flex-end',
}).toString();

const favItemTransitionDuration = 500;

const defaultTransitionStyle = {
  transition: `height ${favItemTransitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
};

const transitionStyles = {
  exited: {
    height: 0,
  },
  exiting: {
    height: 0,
  },
};

/**
 * Creates an object with style attributes to enable a cart item transition.
 * @param {string} state A state of the react-transition-group/Transition component.
 * @return {Object}
 */
const getFavItemTransitionStyle = state => ({
  ...defaultTransitionStyle,
  ...transitionStyles[state],
});

export default {
  container,
  image,
  leftColumn,
  rightColumn,
  name,
  row,
  details,
  detailsRow,
  priceContainer,
  propertiesContainer,
  favItemTransitionDuration,
  getFavItemTransitionStyle,
};
