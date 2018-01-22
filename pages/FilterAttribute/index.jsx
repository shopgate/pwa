/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import Attribute from './components/Attribute';
import Item from './components/Item';
import ClearButton from './components/ClearButton';
import connect from './connector';
import styles from './style';

/**
 * The Filter Attribute view component.
 */
class FilterAttribute extends Component {
  static propTypes = {
    mergeTemporaryFilters: PropTypes.func.isRequired,
    removeTemporaryFilter: PropTypes.func.isRequired,
    setFilterAttributeClosed: PropTypes.func.isRequired,
    setFilterAttributeOpened: PropTypes.func.isRequired,
    temporaryFilters: PropTypes.shape().isRequired,
    currentAttribute: PropTypes.shape(),
  };

  static defaultProps = {
    currentAttribute: null,
  };

  /**
   * Marks the filter page as open when entering the page.
   */
  componentDidMount() {
    this.props.setFilterAttributeOpened();
  }

  /**
   * Marks the filter page as closed when leaving the page.
   */
  componentWillUnmount() {
    this.props.setFilterAttributeClosed();
  }

  /**
   * Updates the current filter options selection.
   * @param {Array} attributeId A set of strings containing the current selected attribute options.
   * @param {Array} valueId A set of strings containing the current selected attribute options.
   * @param {number} index The index of the selected item, relative to its list.
   */
  handleSelection = (attributeId, valueId) => {
    const { currentAttribute, temporaryFilters } = this.props;

    // Get the temporary filters for this particular attribute.
    const tempFilters = temporaryFilters[currentAttribute.id] || {};

    // Get the values inside the temporary filter.
    let { values = [] } = tempFilters;

    /**
     * We need to find the index of the value so that we know which item to
     * remove from the temporary filter.
     */
    const valueIndex = values.indexOf(valueId);

    if (valueIndex > -1) {
      this.props.removeTemporaryFilter(attributeId, valueIndex);
    } else {
      // Add to selection.
      values = [...values, valueId];

      this.props.mergeTemporaryFilters({
        [currentAttribute.id]: {
          label: currentAttribute.label,
          source: currentAttribute.source,
          type: currentAttribute.type,
          values,
        },
      });
    }
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    if (!this.props.currentAttribute) {
      return <View />;
    }

    const tempFilter = this.props.temporaryFilters[this.props.currentAttribute.id] || {};
    const activeValues = tempFilter.values || [];
    const { currentAttribute } = this.props;

    return (
      <View title={currentAttribute.label}>
        <div className={styles}>
          <Attribute>
            {currentAttribute.values.map(value => (
              <Item
                key={value.id}
                label={value.label}
                value={value.id}
                onClick={() => this.handleSelection(currentAttribute.id, value.id)}
                checked={activeValues.includes(value.id)}
              />
            ))}
          </Attribute>
          <ClearButton values={activeValues} currentAttribute={currentAttribute} />
        </div>
      </View>
    );
  }
}

export default connect(FilterAttribute);
