/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * Calculates the angle for the strike-through line
 * @param {HTMLElement} element The price element
 * @returns {number} the calculated angle
 */
const calcAngle = (element) => {
  /**
   * If the element is in a hidden container the browser won't calculate it's size.
   * In that case we clone in into a visible container and then remove it again.
   */
  const cloned = element.cloneNode(true);
  document.body.appendChild(cloned);

  const width = cloned.offsetWidth;
  const height = cloned.offsetHeight;

  document.body.removeChild(cloned);

  // Calculate the correct angle for the strike-through line
  return Math.round(90 - (Math.atan(width / height) * (180 / Math.PI)));
};

/**
 * The price striked component
 * @param {Object} props The component props
 * @param {number} props.value The sriked price of the product
 * @param {string} props.currency The currency of the price
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
class PriceStriked extends Component {
  static propTypes = {
    currency: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  /**
   * Constructor
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);
    this.angle = null;
    this.element = null;
  }

  /**
   * Updates the component one more time with the calculated angle
   * based on the DOM element.
   */
  componentDidMount() {
    if (this.setAngle()) {
      this.forceUpdate();
    }
  }

  /**
   * Sets the calculated angle for the DOM element
   * and returns true if succeeded.
   * @param {Object} element The target element.
   * @returns {boolean}
   */
  setAngle = () => {
    if (this.element) {
      this.angle = calcAngle(this.element);
      return true;
    }

    return false;
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const angleStyle = this.angle ? styles.getAngleStyle(this.angle) : '';

    return (
      <div className={`${styles.basic} ${this.props.className} ${angleStyle}`}>
        <span ref={(ref) => { this.element = ref; }}>
          <I18n.Price price={this.props.value} currency={this.props.currency} />
        </span>
      </div>
    );
  }
}

export default PriceStriked;
