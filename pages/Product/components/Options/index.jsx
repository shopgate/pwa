/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Picker from 'Components/Picker';
import PriceDifference from './components/PriceDifference';
import connect from './connector';
import styles from './style';

const PICKER_CHANGE_DELAY = 300;

/**
 * The Product Options component.
 */
class Options extends Component {
  static propTypes = {
    setProductOption: PropTypes.func.isRequired,
    currentOptions: PropTypes.shape(),
    options: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    currentOptions: {},
    options: null,
  };

  /**
   * Triggers setProductOptions when the component is mounted and has options set.
   */
  componentDidMount() {
    if (!this.props.setProductOption || !this.props.options) {
      return;
    }

    this.props.options.forEach((option) => {
      // Only options of type 'select' have a default value. Type 'text' has no default.
      if (option.type !== 'select') {
        return;
      }

      this.props.setProductOption(option.id, option.items[0].value);
    });
  }

  /**
   * When the component receives the product options
   * it will set the first value of each option as active
   * @param {Object} nextProps The incoming props.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.options && nextProps.options) {
      nextProps.options.forEach((option) => {
        // Only options of type 'select' have a default value. Type 'text' has no default.
        if (option.type !== 'select') {
          return;
        }

        this.props.setProductOption(option.id, option.items[0].value);
      });
    }
  }

  /**
   * Only update when options change.
   * @param {Object} nextProps The incoming props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return this.props.options !== nextProps.options ||
      this.props.currentOptions !== nextProps.currentOptions;
  }

  /**
   * Handles change callbacks from Picker components.
   * @param {string} id The Picker Id
   * @param {*} value The Picker value
   */
  handlePickerChange = (id, value) => {
    setTimeout(
      () => this.props.setProductOption(id, value),
      PICKER_CHANGE_DELAY
    );
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    const { options, currentOptions } = this.props;

    if (options === null) {
      return null;
    }

    return (
      <div>
        {options.map(({ id, type, label, items }) => {
          if (type !== 'select') {
            return null;
          }

          return (
            <Picker
              key={id}
              label={label}
              items={items.map(item => ({
                ...item,
                rightComponent: (
                  <PriceDifference
                    className={styles.price}
                    currency={item.currency}
                    difference={item.price}
                  />
                ),
              }))}
              placeholder={
                <I18n.Text string="product.pick_an_attribute" params={[label]} />
              }
              value={currentOptions[id]}
              onChange={value => this.handlePickerChange(id, value)}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(Options);
