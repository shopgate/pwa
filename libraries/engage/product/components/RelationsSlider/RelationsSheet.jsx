import React, {
  useState, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { useWidgetSettings, useTheme } from '../../../core';
import { SheetDrawer, I18n, Button } from '../../../components';
import { WIDGET_ID } from './constants';
import connect from './RelationsSheet.connector';

const { variables } = themeConfig;

const useStyles = makeStyles()(theme => ({
  showMore: {
    position: 'absolute !important',
    top: theme.spacing(-0.5),
    right: 0,
    padding: `${theme.spacing(0.5, 0)} !important`,
  },
  sheet: {
    maxHeight: `calc(100vh - ${variables.navigator.height}px)`,
  },
}));

/**
 * Shows a Sheet Drawer with all related products.
 * @returns {JSX}
 */
const RelationsSheet = memo(({ products: { products } }) => {
  const { classes } = useStyles();
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
    <>
      <Button onClick={handleOpen} flat className={classes.showMore}>
        <I18n.Text string="product.relations.showMore" />
      </Button>
      <SheetDrawer isOpen={show} title={headline} onClose={handleClose}>
        <div className={classes.sheet}>
          <ProductGrid products={products} infiniteLoad={false} />
        </div>
      </SheetDrawer>
    </>
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
