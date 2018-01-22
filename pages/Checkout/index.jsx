/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import trackingCore from '@shopgate/tracking-core/core/Core';
import connect from './connector';

/**
 * The checkout view component. Only a dummy to handle the legacy redirect.
 */
class Checkout extends Component {
  static propTypes = {
    fetchCheckoutUrl: PropTypes.func.isRequired,
    goBackHistory: PropTypes.func.isRequired,
  };

  /**
   * Opens the legacy checkout.
   * @param {Object} props The props of the Component
   */
  constructor(props) {
    super(props);

    // Request an url for the checkout page.
    props.fetchCheckoutUrl()
      .then((url) => {
        // Redirect to the checkout url, or the legacy checkout, if none was provided.
        this.redirect(url || '/checkout_legacy');
      })
      .catch(() => {
        props.goBackHistory(1);
      });
  }

  /**
   * Redirects to user to the given url and goes one step back in history.
   * @param {string} url The url where the user should be redirected to.
   */
  redirect(url) {
    // Add some tracking params for cross domain tracking.
    const newUrl = trackingCore.crossDomainTracking(url);

    // Redirect to the checkout
    const link = new ParsedLink(newUrl || url);
    link.open();

    // Go back to hide the dummy page
    this.props.goBackHistory(1);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return null;
  }
}

export default connect(Checkout);
