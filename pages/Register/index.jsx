/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import connect from './connector';

/**
 * The checkout view component. Only a dummy to handle the legacy redirect.
 */
class Register extends Component {
  static propTypes = {
    fetchRegisterUrl: PropTypes.func.isRequired,
    goBackHistory: PropTypes.func.isRequired,
    hasRegisterUrl: PropTypes.bool,
  };

  static defaultProps = {
    hasRegisterUrl: false,
  };

  /**
   * Opens the legacy checkout.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    if (props.hasRegisterUrl) {
      // If the shop has a registration url, we have to check if it is still valid.
      props.fetchRegisterUrl()
        .then((url) => {
          this.redirect(url);
        })
        .catch(() => {
          props.goBackHistory(2);
        });
    } else {
      // The shop doesn't have a registerUrl so we have to redirect to the legacy registration.
      this.redirect('/register_legacy');
    }
  }

  /**
   * Redirects to user to the given url and goes one step back in history.
   * @param {string} url The url where the user should be redirected to.
   */
  redirect(url) {
    // Redirect to the checkout
    const link = new ParsedLink(url);
    link.open();

    // Go back to hide the dummy page
    this.props.goBackHistory(2);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return null;
  }
}

export default connect(Register);
