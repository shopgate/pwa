/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import ActionButton from 'Components/ActionButton';
import connect from './connector';

/**
 * The apply filter button component.
 */
class ApplyFilterButton extends Component {
  static propTypes = {
    applyFilters: PropTypes.func.isRequired,
    filtersChanged: PropTypes.bool,
  };

  static defaultProps = {
    filtersChanged: true,
  };

  /**
   * Apply filters and fire up the DeLorean.
   */
  handleApplyFilters = () => {
    this.props.applyFilters();
  }

  /**
   * [render description]
   * @returns {JSX}
   */
  render() {
    return (
      <ActionButton
        onClick={this.handleApplyFilters}
        disabled={!this.props.filtersChanged}
      >
        <I18n.Text string="filter.apply" />
      </ActionButton>
    );
  }
}

export default connect(ApplyFilterButton);

// For testing.
export { ApplyFilterButton as Unwrapped };
