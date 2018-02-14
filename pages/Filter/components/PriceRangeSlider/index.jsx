/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import RangeSlider from '@shopgate/pwa-common/components/RangeSlider';
import I18n from '@shopgate/pwa-common/components/I18n';
import styles from './style';

/**
 * The Price Range Slider component.
 */
class PriceRangeSlider extends Component {
  static propTypes = {
    max: PropTypes.number, // The maximum range value.
    min: PropTypes.number, // The minimum range value.
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    max: 100,
    min: 0,
    onChange: () => {},
    value: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    const initialValue = props.value || [props.min, props.max];

    this.state = {
      realValue: initialValue,
      value: initialValue,
    };
  }

  /**
   * Updates the realValue state.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.value, this.props.value)) {
      this.setState({ realValue: nextProps.value });
    }
  }

  /**
   * The callback function that is given to the RangeSlider.
   * @param {Array} value The lower and upper boundary of the set range.
   */
  onChange = (value) => {
    const roundedValue = [
      Math.floor(value[0]),
      Math.ceil(value[1]),
    ];

    this.setState({
      realValue: value,
      value: roundedValue,
    });

    this.props.onChange(roundedValue[0], roundedValue[1]);
  };

  /**
   * Renders the component (template).
   * @returns {JSX}
   */
  render() {
    const { min, max } = this.props;
    const { __ } = this.context.i18n();
    const currency = __('price.currency');

    /**
     * The min and max price need to be rounded before they are passed to the I18n component,
     * since it rounds to the full nearest number when fractions are deactivated.
     */
    const priceMin = Math.floor(this.state.value[0] / 100);
    const priceMax = Math.ceil(this.state.value[1] / 100);

    return (
      <div className={styles.wrapper}>
        <I18n.Text string="price.range">
          <I18n.Placeholder forKey="fromPrice">
            <span className={styles.price}>
              <I18n.Price
                price={priceMin}
                currency={currency}
                fractions={false}
              />
            </span>
          </I18n.Placeholder>
          <I18n.Placeholder forKey="toPrice">
            <span className={styles.price}>
              <I18n.Price
                price={priceMax}
                currency={currency}
                fractions={false}
              />
            </span>
          </I18n.Placeholder>
        </I18n.Text>
        <RangeSlider
          classNames={styles.rangeSlider}
          easing="exponential"
          factor={3}
          max={max}
          min={min}
          onChange={this.onChange}
          value={this.state.realValue}
        />
      </div>
    );
  }
}

export default PriceRangeSlider;
