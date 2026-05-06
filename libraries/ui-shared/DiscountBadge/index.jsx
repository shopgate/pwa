import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const badgeBase = {
  background: 'var(--color-primary)',
  borderRadius: 2,
  color: 'var(--color-primary-contrast)',
  padding: 5,
  width: '100%',
  fontWeight: 700,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  ...themeConfig.variables.discountBadgeBase,
};

const useStyles = makeStyles()(() => ({
  small: {
    ...badgeBase,
  },
  big: {
    ...badgeBase,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
}));

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
      <I18n.Text
        className={cx(displayClass, className, 'theme__discount-badge')}
        string={text}
        params={[discount]}
        aria-hidden
      />
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
