import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import times from 'lodash/times';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core';
import StarIcon from '../StarIcon';
import StarHalfIcon from '../StarHalfIcon';
import { RATING_SCALE_DIVISOR, NUMBER_OF_STARS } from '../../../constants';

const { colors } = themeConfig;

const ICON_SIZES = {
  small: '1em',
  big: '1.24em',
  large: '2.3em',
};

const DISPLAY_KEYS = Object.keys(ICON_SIZES);

const useStyles = makeStyles()(() => ({
  container: {
    position: 'relative',
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'top',
    outline: 0,
  },
  emptyStars: {
    color: colors.shade7,
  },
  filledStars: {
    position: 'absolute',
    color: 'var(--color-primary)',
    top: 0,
  },
  iconSmall: {
    marginRight: '0.1em',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: '1.125rem',
    },
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      fontSize: '1.25rem',
    },
  },
  iconBig: {
    marginRight: '0.12em',
  },
  iconLarge: {
    marginRight: '0.23em',
  },
}));

const displayToIconClass = {
  small: 'iconSmall',
  big: 'iconBig',
  large: 'iconLarge',
};

/**
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Stars = ({
  className = '',
  display = 'small',
  isSelectable = false,
  onSelection = () => {},
  value = 0,
}) => {
  const { classes, cx } = useStyles();

  const ratedStars = value / RATING_SCALE_DIVISOR;
  const numFullStars = Math.floor(ratedStars);
  const numHalfStars = Math.ceil(ratedStars - numFullStars);

  const size = ICON_SIZES[display];
  const iconClassKey = displayToIconClass[display];
  const rootClass = cx(classes.container, className);
  const iconClassName = cx(classes.icon, classes[iconClassKey]);

  const getTextualCTA = useCallback(stars => (
    i18n.text('reviews.press_to_rate_with_x_stars', { rate: stars })
  ), []);

  const handleSelection = useCallback((e, pos) => {
    e.target.value = pos * RATING_SCALE_DIVISOR;
    onSelection(e);
  }, [onSelection]);

  const emptyStars = useMemo(() => (
    times(NUMBER_OF_STARS, (i) => {
      const pos = i + 1;
      const starProps = {
        className: iconClassName,
        key: pos,
        ...(isSelectable && {
          'aria-label': getTextualCTA(pos),
          role: 'button',
          onClick: e => handleSelection(e, pos),
        }),
      };

      return (
        <div {...starProps}>
          <StarIcon size={size} />
        </div>
      );
    })
  ), [iconClassName, isSelectable, size, getTextualCTA, handleSelection]);

  const filledStars = useMemo(() => ([
    ...times(numFullStars, (i) => {
      const pos = i + 1;
      const starProps = {
        className: iconClassName,
        key: NUMBER_OF_STARS + pos,
        ...(isSelectable && {
          'aria-hidden': true,
          role: 'button',
          onClick: e => handleSelection(e, pos),
        }),
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
  ]), [numFullStars, numHalfStars, iconClassName, isSelectable, size, handleSelection]);

  return (
    <div
      className={rootClass}
      data-test-id={`ratedStars: ${ratedStars}`}
      aria-hidden
    >
      <div className={cx(classes.emptyStars, 'rating-stars-empty')}>
        {emptyStars}
      </div>
      <div className={cx(classes.filledStars, 'rating-stars-filled')}>
        {filledStars}
      </div>
    </div>
  );
};

Stars.propTypes = {
  className: PropTypes.string,
  display: PropTypes.oneOf(DISPLAY_KEYS),
  isSelectable: PropTypes.bool,
  onSelection: PropTypes.func,
  value: PropTypes.number,
};

Stars.defaultProps = {
  className: '',
  display: 'small',
  isSelectable: false,
  onSelection: () => {},
  value: 0,
};

export default memo(Stars);
