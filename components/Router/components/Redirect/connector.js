/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import trampolineRedirect from '../../../../actions/history/trampolineRedirect';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  trampolineRedirect: (trampolineLocation, redirectUrlLocation) =>
    dispatch(trampolineRedirect(trampolineLocation, redirectUrlLocation)),
});

/**
 * Connects a component to the link dispatcher(s).
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const link = Component => connect(null, mapDispatchToProps, null, { withRef: true })(Component);

export default link;
