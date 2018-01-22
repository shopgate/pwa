/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
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
    isSelectable: PropTypes.bool,
    onSelection: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    display: 'small',
    isSelectable: false,
    onSelection: () => {
    },
  };

  /**
   * Context types definition.
   * @type {{i18n: shim}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
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
   * Returns textual version of stars for screen readers.
   * @param {number} stars Number of stars.
   * @returns {string}
   */
  getTextualFinal(stars) {
    const { __ } = this.context.i18n();
    return __('reviews.rating_stars', { rate: stars });
  }

  /**
   * Returns text for call to a
   * @param {number} stars Number of stars.
   * @returns {string}
   */
  getTextualCTA(stars) {
    const { __ } = this.context.i18n();
    return __('reviews.press_to_rate_with_x_stars', { rate: stars });
  }

  /**
   * Handles click on RatingStars.
   * @param {Object} e SyntheticEvent.
   * @param {number} pos Position/Index of clicked RatingStar.
   */
  handleSelection(e, pos) {
    const { onSelection } = this.props;
    e.target.value = pos * RATING_SCALE_DIVISOR;
    onSelection(e);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { value, isSelectable } = this.props;
    const numStars = 5;
    const ratedStars = value / RATING_SCALE_DIVISOR;
    const numFullStars = Math.floor(ratedStars);
    const numHalfStars = Math.ceil(ratedStars - numFullStars);

    const size = styles.iconStyles[this.props.display].iconSize;

    const className = [styles.container, this.props.className].join(' ');
    const iconClassName = [styles.iconStyles[this.props.display].iconStyle, styles.icon].join(' ');

    const emptyStars = [
      ...times(numStars, (i) => {
        const pos = i + 1;
        const starProps = {
          className: iconClassName,
          key: pos,
          ...(isSelectable) && {
            'aria-label': this.getTextualCTA(pos),
            role: 'button',
            onClick: e => this.handleSelection(e, pos),
          },
        };

        return (
          <div {...starProps}>
            <StarIcon size={size} />
          </div>
        );
      }),
    ];

    const filledStars = [
      ...times(numFullStars, (i) => {
        const pos = i + 1;
        const starProps = {
          className: iconClassName,
          key: numStars + pos,
          ...(isSelectable) && {
            'aria-hidden': true, // Aria hidden since it's basically a duplicate for a screen reader.
            role: 'button',
            onClick: e => this.handleSelection(e, pos),
          },
        };

        return (
          <div {...starProps}>
            <StarIcon size={size} />
          </div>
        );
      }),
      ...times(numHalfStars, i =>
        <div className={iconClassName} key={i + numFullStars}>
          <StarHalfIcon size={size} />
        </div>
      ),
    ];

    return (
      <div className={className} aria-label={this.getTextualFinal(ratedStars)}>
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
