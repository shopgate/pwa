import React, { useState, useCallback, useEffect, Fragment, memo } from 'react';
import { useWidgetSettings, useTheme } from '../../../core';
import { SheetDrawer, I18n } from '../../../components';
import { WIDGET_ID } from './constants';
import { showMore, sheet } from './style';
import connect from './connector';

/**
 * Shows a Sheet Drawer with all related products.
 * @returns {JSX}
 */
const RealtionsSheet = memo(connect(({ products, getRelations }) => {
  const [show, setShow] = useState(false);
  const { headline } = useWidgetSettings(WIDGET_ID);
  const { ProductGrid } = useTheme();

  useEffect(() => {
    getRelations();
  }, []);

  const handleOpen = useCallback((event) => {
    event.preventDefault();
    setShow(true);
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <Fragment>
      <a href="#relations" className={showMore} onClick={handleOpen}>
        <I18n.Text string="product.relations.showMore" />
      </a>
      <SheetDrawer isOpen={show} title={headline} onClose={handleClose}>
        <div className={sheet}>
          <ProductGrid products={products} infiniteLoad={false} />
        </div>
      </SheetDrawer>
    </Fragment>
  );
}));

export default RealtionsSheet;
