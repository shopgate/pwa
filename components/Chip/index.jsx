/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import CrossIcon from 'Components/icons/CrossIcon';
import colors from 'Styles/colors';
import styles from './style';

/**
 * The Chip component.
 */
class Chip extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    invert: PropTypes.bool,
    onClick: PropTypes.func,
    onRemove: PropTypes.func,
    removable: PropTypes.bool,
  };

  static defaultProps = {
    invert: false,
    onClick: () => {},
    onRemove: () => {},
    removable: true,
  };

  /**
   * When the component updates make sure that inline styles are removed.
   * This is required because even when re-rendering the component, react doesn't
   * check the inline stylings.
   * We therefore explicitly force to remove the styling after rendering.
   * ChipsLayout will add custom styles and expects the component to not have any styling
   * after re-rendering.
   */
  componentDidUpdate() {
    this.elementRef.removeAttribute('style');
  }

  /**
   * Returns a class name for the wrapper.
   * @returns {string}
   */
  get wrapperStyle() {
    return styles.chip(this.props.removable, this.props.invert);
  }

  /**
   * Returns the chip's font color.
   * @returns {string}
   */
  get crossFontColor() {
    if (this.props.invert) {
      return colors.light;
    }

    return colors.accent;
  }

  /**
   * Renders the remove icon of the chip if it can be removable.
   * @returns {JSX|null}
   */
  renderRemoveIcon() {
    if (!this.props.removable) {
      return null;
    }

    return (
      <Button className={styles.removeButton} onClick={this.props.onRemove}>
        <CrossIcon size={16} color={this.crossFontColor} />
      </Button>
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div
        ref={(element) => { this.elementRef = element; }}
        className={this.wrapperStyle}
      >
        {this.renderRemoveIcon()}
        <Button className={styles.name} onClick={this.props.onClick}>
          {this.props.children}
        </Button>
      </div>
    );
  }
}

export default Chip;
