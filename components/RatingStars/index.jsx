/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import times from 'lodash/times';
import StarIcon from 'Components/icons/StarIcon';
import StarHalfIcon from 'Components/icons/StarHalfIcon';
import styles from './style';
import { RATING_SCALE_DIVISOR } from './constants';

/**
 * The available style keys for the rating stars.
 */
const availableStyles = styles.iconStyles;

/**
 * The rating stars component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class RatingStars extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
    display: PropTypes.oneOf(Object.keys(availableStyles)),
  };

  static defaultProps = {
    className: '',
    display: 'small',
  };

  /**
   * Only update the component if the star rating changed.
   * @param {Object} nextProps The next component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { value } = this.props;
    const numStars = 5;
    const ratedStars = value / RATING_SCALE_DIVISOR;
    const numFullStars = Math.floor(ratedStars);
    const numHalfStars = Math.ceil(ratedStars - numFullStars);

    const size = styles.iconStyles[this.props.display].iconSize;

    const className = [styles.container, this.props.className].join(' ');
    const iconClassName = [styles.iconStyles[this.props.display].iconStyle, styles.icon].join(' ');

    const emptyStars = [
      ...times(numStars, i =>
        <div className={iconClassName} key={i}>
          <StarIcon size={size} />
        </div>
      ),
    ];
    const filledStars = [
      ...times(numFullStars, i =>
        <div className={iconClassName} key={i}>
          <StarIcon size={size} />
        </div>
      ),
      ...times(numHalfStars, i =>
        <div className={iconClassName} key={i + numFullStars}>
          <StarHalfIcon size={size} />
        </div>
      ),
    ];

    return (
      <div className={className}>
        <div className={styles.emptyStars}>
          {emptyStars}
        </div>
        <div className={styles.filledStars}>
          {filledStars}
        </div>
      </div>
    );
  }
}

export default RatingStars;
