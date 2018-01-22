/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import CategoryList from 'Components/CategoryList';
import Headline from 'Components/Headline';
import connect from './connector';
import SearchField from './components/SearchField';

/**
 * Renders the browser page.
 * @returns {JSX}
 */
class Browse extends Component {
  static propTypes = {
    getCategory: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    categories: [],
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Requests the root categories.
   */
  componentDidMount() {
    this.props.getCategory(null);
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <View>
        <Headline text={'titles.browse'} />
        <SearchField />
        <Headline text={'titles.categories'} small />
        <CategoryList categories={this.props.categories || []} />
      </View>
    );
  }
}

export default connect(Browse);
