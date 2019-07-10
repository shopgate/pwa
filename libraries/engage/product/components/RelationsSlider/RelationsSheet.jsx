import React, { useState, useCallback, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings, useTheme } from '../../../core';
import { SheetDrawer, I18n, Button } from '../../../components';
import { WIDGET_ID } from './constants';
import { showMore, sheet } from './style';
import connect from './RelationsSheet.connector';

/**
 * Shows a Sheet Drawer with all related products.
 * @returns {JSX}
 */
const RelationsSheet = memo(({ products: { products } }) => {
  const [show, setShow] = useState(false);
  const { headline } = useWidgetSettings(WIDGET_ID);
  const { ProductGrid } = useTheme();

  const handleOpen = useCallback((event) => {
    event.preventDefault();
    setShow(true);
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <Fragment>
      <Button onClick={handleOpen} flat className={showMore}>
        <I18n.Text string="product.relations.showMore" />
      </Button>
      <SheetDrawer isOpen={show} title={headline} onClose={handleClose}>
        <div className={sheet}>
          <ProductGrid products={products} infiniteLoad={false} />
        </div>
      </SheetDrawer>
    </Fragment>
  );
});

RelationsSheet.propTypes = {
  products: PropTypes.shape({
    products: PropTypes.arrayOf(PropTypes.shape()),
    productCount: PropTypes.number,
  }),
};

RelationsSheet.defaultProps = {
  products: {
    products: [],
    productCount: 0,
  },
};

export default connect(RelationsSheet);
