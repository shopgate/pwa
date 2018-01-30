/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import { getProductById } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the current application state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The current component props.
 * @return {Object} The populated component props.
 */
const mapStateToProps = (state, props) => ({
  product: getProductById(state, props.id).productData || null,
});

export default connect(mapStateToProps);
