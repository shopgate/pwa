import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { i18n } from '@shopgate/engage/core';
import { ConditionalWrapper } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './PriceInfo.connector';

const styles = {
  container: css({
    color: themeConfig.colors.shade3,
  }).toString(),
  noWrap: css({
    whiteSpace: 'nowrap',
  }).toString(),
};

/**
 * The price info component
 * @returns {JSX}
 */
const PriceInfo = ({
  product, className, wrapper, displayPricePerMeasureUnit, currency: externalCurrency,
}) => {
  const { price = {}, unitPriceRefValue, unitPriceRefUom } = product || {};
  const { pricePerMeasureUnit, info, currency } = price;

  const content = useMemo(() => {
    if (!displayPricePerMeasureUnit) {
      return info;
    }

    if (!pricePerMeasureUnit) {
      return null;
    }

    return i18n.text('price.pricePerMeasurementFormat', {
      price: i18n.price(pricePerMeasureUnit, currency || externalCurrency, 2),
      refValue: unitPriceRefValue,
      refUom: unitPriceRefUom,
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
        className={classNames(styles.container, className, {
          [styles.noWrap]: displayPricePerMeasureUnit,
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
