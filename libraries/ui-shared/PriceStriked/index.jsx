import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

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

  return Math.round(90 - (Math.atan(width / height) * (180 / Math.PI)));
};

const useStyles = makeStyles()({
  root: {
    whiteSpace: 'nowrap',
    color: themeColors.shade11,
    '& span': {
      position: 'relative',
      '&::before': {
        borderColor: 'currentColor',
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
      },
    },
  },
  strikeActive: {
    '& span': {
      '&::before': {
        borderTop: '1px solid',
        transform: 'rotate(calc(var(--price-strike-deg) * -1deg))',
      },
    },
  },
});

/**
 * The price striked component
 * @param {Object} props The component props
 * @param {number} props.value The striked price of the product
 * @param {string} props.currency The currency of the price
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
const PriceStriked = ({ className, currency, value }) => {
  const { classes } = useStyles();
  const [angle, setAngle] = useState(null);
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      setAngle(calcAngle(elementRef.current));
    }
  }, []);

  return (
    <>
      <div
        className={classNames(
          classes.root,
          angle != null && classes.strikeActive,
          className,
          'price-striked',
          'ui-shared__price-striked'
        )}
        style={angle != null ? { '--price-strike-deg': angle } : undefined}
      >
        <span
          aria-hidden
          ref={elementRef}
          data-test-id={`strikedPrice: ${value}`}
        >
          <I18n.Price price={value} currency={currency} />
        </span>
      </div>
      <span className="sr-only">
        {i18n.text('price.label_old_price', {
          price: i18n.price(value, currency, true),
        })}
      </span>
    </>
  );
};

PriceStriked.propTypes = {
  currency: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

PriceStriked.defaultProps = {
  className: '',
};

export default PriceStriked;
