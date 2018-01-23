/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compareObjects } from '@shopgate/pwa-common/helpers/redux';
import Sort from './components/Sort';
import ViewSwitch from './components/ViewSwitch';
import FilterButton from './components/FilterButton';
import FilterChips from './components/FilterChips';
import connect from './connector';
import styles from './style';

/**
 * The Filter bar component.
 */
class Content extends Component {
  static propTypes = {
    componentUpdated: PropTypes.func.isRequired,
    getFilters: PropTypes.func.isRequired,
    activeFilters: PropTypes.shape(),
  };

  static defaultProps = {
    activeFilters: {},
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Called after mount. Sets up the scroll DOM elements.
   */
  componentDidMount() {
    this.props.getFilters();
  }

  /**
   * Called before the component receives new properties. Sets up the scroll DOM elements.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!compareObjects(nextProps.activeFilters, this.props.activeFilters)) {
      this.props.getFilters();
    }
  }

  /**
   * Call parents' callback to trigger some re-calculation.
   */
  componentDidUpdate() {
    this.props.componentUpdated();
  }

  /**
   * Returns the currency.
   * @return {string}
   */
  get currency() {
    /**
     * TODO: Remove context translation for currency and,
     * instead, get it from shop settings when available.
     */
    const { __ } = this.context.i18n();
    return __('price.currency');
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <section>
        <div className={styles}>
          <ViewSwitch />
          <Sort />
          <FilterButton />
        </div>
        <FilterChips currency={this.currency} />
      </section>
    );
  }
}

export const UnwrappedFilterBarContent = Content;

export default connect(Content);
