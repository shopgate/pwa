import React from 'react';
import { BackBar } from 'Components/AppBar/presets';
import CartButton from 'Components/AppBar/components/CartButton';

/**
 * The BackInStockAppBar component.
 * @returns {JSX}
 */
function BackInStockAppBar() {
  return (
    <BackBar title="BACK IN STOCK" right={<CartButton />} />
  );
}

export default BackInStockAppBar;
