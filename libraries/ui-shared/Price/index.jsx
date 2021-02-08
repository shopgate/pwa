import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from '@shopgate/pwa-common/components/I18n';
import showTaxDisclaimer from '@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer';
import { useWidgetSettings } from '@shopgate/engage/core/hooks/useWidgetSettings';
import styles from './style';

/**
 * The Price component
 * @param {Object} props The component props
 * @param {string} [props.className] CSS classes
 * @param {string} props.currency The currency of the price
 * @param {number} props.unitPrice The price of the product
 * @param {number} props.unitPriceMin The minimum price of possible child products
 * @param {boolean} props.discounted Tells if the pice is discounted
 * @param {Object} context The component context.
 * @return {JSX}
 */
const Price = (props, context) => {
  const {
    show,
    hint,
  } = useWidgetSettings('@shopgate/engage/components/TaxDisclaimer');

  // use widget setting if set to true/false, otherwise use market logic
  const showDisclaimer = typeof show === 'boolean' ? show : showTaxDisclaimer;

  const containerClasses = classNames(
    styles.container,
    props.className,
    {
      [styles.discounted]: props.discounted,
    },
    'price'
  );

  const { __, _p } = context.i18n();

  let ariaPrice;

  if (props.unitPriceMin) {
    ariaPrice = __('price.from', { price: _p(props.unitPriceMin, props.currency, props.fractions) });
  } else {
    ariaPrice = _p(props.unitPrice, props.currency, props.fractions);
  }

  ariaPrice = ariaPrice.replace('-', '\u2212');

  /* eslint-disable jsx-a11y/aria-role */

  /**
   * A unitPriceMin > 0 means, that the product has child products with different prices.
   * The unitPriceMin contains the lowest of these prices and will be
   * displayed with a 'From' prefix.
   */
  return (
    <div
      className={containerClasses}
      data-test-id={`minPrice: ${props.unitPriceMin} price: ${props.unitPrice} currency: ${props.currency}`}
    >
      <span role="text" aria-label={__('price.label', { price: ariaPrice })}>
        {props.unitPriceMin ? (
          <I18n.Text string="price.from">
            <I18n.Price
              currency={props.currency}
              fractions={props.fractions}
              forKey="price"
              price={props.unitPriceMin}
            />
          </I18n.Text>
        ) : (
          <I18n.Price
            currency={props.currency}
            fractions={props.fractions}
            price={props.unitPrice}
          />
        )}
      </span>
      {props.taxDisclaimer && showDisclaimer ? (
        <div role="text" className={styles.disclaimer} aria-label={__('product.tax_disclaimer')}>
          {hint || '*'}
        </div>
      ) : null}
    </div>
  );
  /* eslint-enable jsx-a11y/aria-role */
};

Price.propTypes = {
  currency: PropTypes.string.isRequired,
  unitPrice: PropTypes.number.isRequired,
  className: PropTypes.string,
  discounted: PropTypes.bool,
  fractions: PropTypes.bool,
  taxDisclaimer: PropTypes.bool,
  unitPriceMin: PropTypes.number,
};

Price.defaultProps = {
  className: '',
  unitPriceMin: 0,
  discounted: false,
  fractions: true,
  taxDisclaimer: false,
};

Price.contextTypes = {
  i18n: PropTypes.func,
};

export default Price;
