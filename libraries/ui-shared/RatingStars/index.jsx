import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import times from 'lodash/times';
import { i18n } from '@shopgate/engage/core/helpers';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import StarIcon from '../icons/StarIcon';
import StarHalfIcon from '../icons/StarHalfIcon';
import { RATING_SCALE_DIVISOR } from './constants';

const DISPLAY_KEYS = ['small', 'big', 'large'];

const ICON_SIZES = {
  small: '1em',
  big: '1.24em',
  large: '2.3em',
};

const useStyles = makeStyles()({
  container: {
    position: 'relative',
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'top',
    outline: 0,
  },
  iconGapSmall: {
    marginRight: '0.1em',
  },
  iconGapBig: {
    marginRight: '0.12em',
  },
  iconGapLarge: {
    marginRight: '0.23em',
  },
  emptyStars: {
    color: themeConfig.colors.shade7,
  },
  filledStars: {
    position: 'absolute',
    color: 'var(--color-primary)',
    top: 0,
  },
});

const numStars = 5;

/**
 * The rating stars component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const RatingStars = ({
  value,
  className,
  display,
  isSelectable,
  onSelection,
}) => {
  const { classes } = useStyles();
  const ratedStars = value / RATING_SCALE_DIVISOR;
  const numFullStars = Math.floor(ratedStars);
  const numHalfStars = Math.ceil(ratedStars - numFullStars);
  const size = ICON_SIZES[display];
  const getTextualFinal = useCallback(stars => (
    i18n.text('reviews.rating_stars', {
      rate: stars,
      maxRate: numStars,
    })
  ), []);

  const getTextualCTA = useCallback(stars => (
    i18n.text('reviews.press_to_rate_with_x_stars', { rate: stars })
  ), []);

  const handleSelection = useCallback((e, pos) => {
    e.target.value = pos * RATING_SCALE_DIVISOR;
    onSelection(e);
  }, [onSelection]);

  const iconClassName = classNames(
    classes.icon,
    display === 'small' && classes.iconGapSmall,
    display === 'big' && classes.iconGapBig,
    display === 'large' && classes.iconGapLarge
  );
  const rootClassName = classNames(classes.container, className, 'ui-shared__rating-stars');

  const emptyStars = [
    ...times(numStars, (i) => {
      const pos = i + 1;
      const starProps = {
        className: iconClassName,
        key: pos,
        ...(isSelectable) && {
          'aria-label': getTextualCTA(pos),
          role: 'button',
          onClick: e => handleSelection(e, pos),
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
          'aria-hidden': true,
          role: 'button',
          onClick: e => handleSelection(e, pos),
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
      className={rootClassName}
      aria-label={getTextualFinal(ratedStars)}
      data-test-id={`ratedStars: ${ratedStars}`}
    >
      <div className={classNames(classes.emptyStars, 'rating-stars-empty')}>
        {emptyStars}
      </div>
      <div className={classNames(classes.filledStars, 'rating-stars-filled')}>
        {filledStars}
      </div>
    </div>
  );
};

RatingStars.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
  display: PropTypes.oneOf(DISPLAY_KEYS),
  isSelectable: PropTypes.bool,
  onSelection: PropTypes.func,
};

RatingStars.defaultProps = {
  className: '',
  display: 'small',
  isSelectable: false,
  onSelection: () => {
  },
};

export default RatingStars;
