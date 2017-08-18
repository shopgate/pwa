/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect as historyConnector } from '@shopgate/pwa-common/connectors/history';
import { connect as navigatorConnector } from '../../connector';
import Logo from './components/Logo';
import Title from './components/Title';
import Search from './components/Search';

/**
 * The navigator content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = (props) => {
  let currentTitle = null;
  if (!props.searchActive) {
    if (props.path === '/') {
      currentTitle = <Logo />;
    } else {
      const isSearching = props.getQueryParam('s') !== undefined;
      currentTitle = <Title onClick={isSearching ? props.submitSearch : null} />;
    }
  }

  return (
    <div>
      {currentTitle}
      <Search active={props.searchActive} />
    </div>
  );
};

Content.propTypes = {
  getQueryParam: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  submitSearch: PropTypes.func.isRequired,
  searchActive: PropTypes.bool,
};

Content.defaultProps = {
  searchActive: false,
};

export default compose(
  navigatorConnector,
  historyConnector
)(Content);
