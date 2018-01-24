/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import connect from './connector';

/**
 * The '(my) orders' view component. Only a dummy to handle the legacy redirect.
 */
class Orders extends Component {
  static propTypes = {
    goBackHistory: PropTypes.func.isRequired,
  };

  /**
   * Opens the legacy order history.
   * @param {Object} props The props of the component.
   */
  constructor(props) {
    super(props);

    // Open the legacy order history
    const link = new ParsedLink('/orders_legacy');
    link.open();

    // Go back to hide the dummy page
    props.goBackHistory(1);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return null;
  }
}

export default connect(Orders);
