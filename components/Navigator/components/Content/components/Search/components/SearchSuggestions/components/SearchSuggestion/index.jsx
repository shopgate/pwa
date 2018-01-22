/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import List from 'Components/List';
import styles from '../../style';

/**
 * Search suggestion list entry component.
 * @param {Object} props The component props.
 * @param {string} props.suggestion The search suggestion text.
 * @param {function} props.onClick The action that is triggered on click.
 * @returns {JSX}
 */
const SearchSuggestion = ({ suggestion, onClick }) => (
  <List.Item
    className={styles.listItem}
    title={suggestion}
    onClick={onClick}
  />
);

SearchSuggestion.propTypes = {
  onClick: PropTypes.func.isRequired,
  suggestion: PropTypes.string.isRequired,
};

export default SearchSuggestion;
