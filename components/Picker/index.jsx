/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasePicker from '@shopgate/pwa-common/components/Picker';
import Sheet from 'Components/Sheet';
import List from 'Components/List';
import Button from './components/Button';
import styles from './style';

/**
 * The template version of the Picker component.
 * @param {Object} props The same component props as in the base Picker component.
 */
class Picker extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    buttonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    buttonProps: PropTypes.shape(),
    clickDelay: PropTypes.number,
  };

  static defaultProps = {
    buttonComponent: null,
    buttonProps: {},
    /**
     * Time in ms that delays picker interaction in order
     * to let animations complete first.
     */
    clickDelay: 150,
  };

  /**
   * Constructor
   * @param {Object} props Props of the component
   */
  constructor(props) {
    super(props);

    this.domElement = null;
    this.modalComponent = modalProps => <Sheet {...modalProps} title={this.props.label} />;
    this.listComponent = ({ items, onSelect, selectedIndex, onClose }) => (
      <List>
        {items.map((item, index) => (
          <List.Item
            key={item.value}
            title={item.label}
            onClick={() => {
              setTimeout(() => {
                onSelect(item.value);
                onClose();
              }, this.props.clickDelay);
            }}
            isDisabled={item.disabled}
            isSelected={index === selectedIndex}
            rightComponent={item.rightComponent}
          />
        ))}
      </List>
    );
  }

  /**
   * Render
   * @returns {JSX}
   */
  render() {
    return (
      <BasePicker
        {...this.props}
        className={styles}
        modalComponent={this.modalComponent}
        buttonProps={this.props.buttonProps}
        buttonComponent={this.props.buttonComponent || Button}
        listComponent={this.listComponent}
        ref={(element) => { this.domElement = element ? element.domElement : null; }}
      />
    );
  }
}

export default Picker;
