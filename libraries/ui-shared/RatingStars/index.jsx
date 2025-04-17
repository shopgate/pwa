import React, { Component } from 'react';
import PropTypes from 'prop-types';
import times from 'lodash/times';
import StarIcon from '../icons/StarIcon';
import StarHalfIcon from '../icons/StarHalfIcon';
import styles from './style';
import { RATING_SCALE_DIVISOR } from './constants';

/**
 * The available style keys for the rating stars.
 */
const availableStyles = styles.iconStyles;
const numStars = 5;

/**
 * The rating stars component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class RatingStars extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
    display: PropTypes.oneOf(Object.keys(availableStyles)),
    isSelectable: PropTypes.bool,
    onSelection: PropTypes.func,
  };

  /**
   * Context types definition.
   * @type {{i18n: function}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    display: 'small',
    isSelectable: false,
    onSelection: () => {
    },
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
    return __('reviews.rating_stars', {
      rate: stars,
      maxRate: numStars,
    });
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
   * @returns {JSX.Element}
   */
  render() {
    const { value, isSelectable } = this.props;
    const ratedStars = value / RATING_SCALE_DIVISOR;
    const numFullStars = Math.floor(ratedStars);
    const numHalfStars = Math.ceil(ratedStars - numFullStars);

    const size = styles.iconStyles[this.props.display].iconSize;

    const className = [styles.container, this.props.className, 'ui-shared__rating-stars'].join(' ');
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
      ...times(numHalfStars, i => (
        <div className={iconClassName} key={i + numFullStars}>
          <StarHalfIcon size={size} />
        </div>
      )),
    ];

    return (
      <div
        role={isSelectable ? undefined : 'img'}
        className={className}
        aria-label={this.getTextualFinal(ratedStars)}
        data-test-id={`ratedStars: ${ratedStars}`}
      >
        <div className={`${styles.emptyStars} rating-stars-empty`}>
          {emptyStars}
        </div>
        <div className={`${styles.filledStars} rating-stars-filled`}>
          {filledStars}
        </div>
      </div>
    );
  }
}

export default RatingStars;
