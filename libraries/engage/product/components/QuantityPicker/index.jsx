import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useWidgetStyles, logger } from '../../../core';
import { I18n, SheetDrawer, SheetList } from '../../../components';
import { getQuantityRange } from './helpers';

let deprecationWarning =
  'QuantityPicker is deprecated in favor of the UnitQuantityPicker component.\nUnitQuantityPicker now additionally supports units and floating point values.';

/** */
function triggerDeprecation() {
  if (deprecationWarning) {
    logger.warn(deprecationWarning);
    deprecationWarning = null;
  }
}

/**
 * The QuantityPicker component.
 * @deprecated Use UnitQuantityPicker to also support different units for quantity.
 * @returns {JSX}
 */
const QuantityPicker = ({ conditioner, setQuantity, stock }) => {
  triggerDeprecation();

  const [opened, setOpened] = useState(false);
  const [resolveValue, setResolveValue] = useState(null);
  const [promiseResolve, setPromiseResolve] = useState(null);

  /**
   * Handle select quantity
   * @param {number} quantity quantity
   */
  const handleSelectQuantity = (quantity) => {
    setQuantity(quantity);
    setResolveValue(true);
    setOpened(false);
  };

  /**
   * Handle close / cancel sheet
   */
  const handleCloseSheet = () => {
    if (resolveValue) {
      return;
    }
    setResolveValue(false);
    setOpened(false);
  };

  /**
   * Open sheet to select quantity,
   * wait user selection before proceed
   * @returns {Promise<any>}
   */
  const checkQuantity = () => (
    new Promise((resolve) => {
      // Set resolve function
      setPromiseResolve(() => resolve);

      // Open sheet
      setOpened(true);
    })
  );

  // Mount effect
  useEffect(() => {
    // Add most late conditioner
    conditioner.addConditioner('product-quantity', checkQuantity, 100);
  }, [conditioner]);

  // Update resolveValue effect
  useEffect(() => {
    if (resolveValue === null) {
      return;
    }

    if (promiseResolve) {
      promiseResolve(resolveValue);
    }
    setResolveValue(null);
  }, [promiseResolve, resolveValue]);

  const styles = useWidgetStyles('@shopgate/engage/product/QuantityPicker');

  if (!stock) {
    return null;
  }

  const { min, max } = getQuantityRange(stock);

  const items = Array((max - min) + 1)
    .fill(min)
    .map((v, index) => String(v + index));

  return (
    <SheetDrawer
      title={<I18n.Text string="product.quantity" />}
      isOpen={opened}
      onClose={handleCloseSheet}
      contentClassName={css(styles.sheet).toString()}
    >
      <SheetList>
        {items.map(item => (
          <SheetList.Item
            title={item}
            key={item}
            onClick={() => handleSelectQuantity(parseInt(item, 10))}
          />
        ))}
      </SheetList>
    </SheetDrawer>
  );
};

QuantityPicker.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  setQuantity: PropTypes.func.isRequired,
  stock: PropTypes.shape(),
};

QuantityPicker.defaultProps = {
  stock: null,
};

export default QuantityPicker;
