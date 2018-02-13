/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { connect } from 'react-redux';
import { isProductOnList } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} product Given product.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, { product }) => ({
  isFavorite: isProductOnList(state, product.id),
});

export default connect(mapStateToProps);
