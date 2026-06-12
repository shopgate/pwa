import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()((theme) => {
  const badgeBase = {
    background: theme.components.discountBadge.background,
    borderRadius: 2,
    color: theme.contrastColor(theme.components.discountBadge.background),
    padding: 5,
    width: '100%',
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };
  return {
    small: {
      ...badgeBase,
    },
    big: {
      ...badgeBase,
      paddingTop: 5,
      paddingLeft: 5,
      paddingRight: 5,
    },
  };
});

const DISPLAY_KEYS = ['small', 'big'];

/**
 * The discount badge component.
 * @param {Object} props The component props
 * @param {string} [props.className] Additional CSS style definitions
 * @param {string} props.text The text contents of the component.
 * @returns {JSX.Element}
 */
const DiscountBadge = ({
  text,
  className,
  display,
  discount,
}) => {
  const { classes, cx } = useStyles();
  const displayClass = display === 'big' ? classes.big : classes.small;

  return (
    <div
      data-test-id={text}
      className="ui-shared__discount-badge"
      aria-label={`${i18n.text('cart.discount')}: ${text}`}
      tabIndex={-1}
    >
      <Typography
        variant="caption"
        align="center"
        className={cx(displayClass, className, 'theme__discount-badge')}
        aria-hidden
      >
        <I18n.Text
          string={text}
          params={[discount]}
        />
      </Typography>
    </div>
  );
};

DiscountBadge.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  discount: PropTypes.number,
  display: PropTypes.oneOf(DISPLAY_KEYS),
};

DiscountBadge.defaultProps = {
  className: '',
  discount: null,
  display: 'small',
};

export default DiscountBadge;
