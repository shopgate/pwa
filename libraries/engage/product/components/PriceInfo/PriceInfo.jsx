import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { i18n } from '@shopgate/engage/core/helpers';
import { ConditionalWrapper } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './PriceInfo.connector';

const useStyles = makeStyles()({
  container: {
    color: themeConfig.colors.shade3,
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
});

/**
 * The price info component
 * @returns {JSX}
 */
const PriceInfo = ({
  product, className, wrapper, displayPricePerMeasureUnit, currency: externalCurrency,
}) => {
  const { classes } = useStyles();
  const { price = {}, unitPriceRefValue, unitPriceRefUom } = product || {};
  const { pricePerMeasureUnit, info, currency } = price;

  const content = useMemo(() => {
    if (!displayPricePerMeasureUnit || !pricePerMeasureUnit) {
      return info;
    }

    if (!pricePerMeasureUnit) {
      return null;
    }

    const unitKey = `formats.unitOfMeasurement.${unitPriceRefUom}`;
    let unit = i18n.text(unitKey);

    if (unit === unitKey) {
      unit = unitPriceRefUom;
    }

    return i18n.text('price.pricePerMeasurementFormat', {
      price: i18n.price(pricePerMeasureUnit, currency || externalCurrency, 2),
      // Don't show base prices like 1.99€/1kg, but show 1.99€/kg instead
      refValue: !!unitPriceRefValue && unitPriceRefValue !== 1 ? unitPriceRefValue : '',
      refUom: unit,
    });
  }, [
    currency,
    displayPricePerMeasureUnit,
    externalCurrency,
    info,
    pricePerMeasureUnit,
    unitPriceRefUom,
    unitPriceRefValue,
  ]);

  if (!content) {
    return null;
  }

  return (
    <ConditionalWrapper
      condition={!!wrapper}
      wrapper={wrapper}
    >
      <div
        className={classNames(classes.container, className, 'engage__product__price-info', {
          [classes.noWrap]: content !== info,
        })}
        dangerouslySetInnerHTML={{ __html: content }}
        data-test-id={`priceInfo: ${content}`}
      />
    </ConditionalWrapper>
  );
};

PriceInfo.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.string,
  displayPricePerMeasureUnit: PropTypes.bool,
  product: PropTypes.shape(),
  wrapper: PropTypes.func,
};

PriceInfo.defaultProps = {
  product: null,
  className: null,
  currency: null,
  wrapper: null,
  displayPricePerMeasureUnit: false,
};

export default connect(PriceInfo);
