import React, { Component } from 'react';
import PropTypes from 'prop-types';
import times from 'lodash/times';
import StarIcon from '../StarIcon';
import StarHalfIcon from '../StarHalfIcon';
import styles from './style';
import { RATING_SCALE_DIVISOR, NUMBER_OF_STARS } from '../../../constants';

/**
 * The available style keys for the rating stars.
 */
const availableStyles = styles.iconStyles;

/**
 * The rating stars component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
class Stars extends Component {
  static propTypes = {
    className: PropTypes.string,
    display: PropTypes.oneOf(Object.keys(availableStyles)),
    isSelectable: PropTypes.bool,
    onSelection: PropTypes.func,
    value: PropTypes.number,
  };

  /**
   * Context types definition.
   * @type {{i18n: shim}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    display: 'small',
    isSelectable: false,
    onSelection: () => {},
    value: 0,
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
   * Returns text for call to a
   * @param {number} stars Number of stars.
   * @returns {string}
   */
  getTextualCTA(stars) {
    const { __ } = this.context.i18n();
    return __('reviews.press_to_rate_with_x_stars', { rate: stars });
  }

  /**
   * Handles click on Stars.
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
    const {
      value,
      isSelectable,
    } = this.props;
    const ratedStars = value / RATING_SCALE_DIVISOR;
    const numFullStars = Math.floor(ratedStars);
    const numHalfStars = Math.ceil(ratedStars - numFullStars);

    const size = styles.iconStyles[this.props.display].iconSize;

    const className = [styles.container, this.props.className].join(' ');
    const iconClassName = [styles.iconStyles[this.props.display].iconStyle, styles.icon].join(' ');

    const emptyStars = [
      ...times(NUMBER_OF_STARS, (i) => {
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
          key: NUMBER_OF_STARS + pos,
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
        className={className}
        data-test-id={`ratedStars: ${ratedStars}`}
        aria-hidden
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

export default Stars;
