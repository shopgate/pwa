import { useSelector } from 'react-redux';
import { PlaceholderIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { getProductImagePlaceholder } from '@shopgate/engage/settings/selectors/shopSettings';
import ProductImagePlaceholder from '@shopgate/engage/product/components/ProductImage/ProductImagePlaceholder';

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '65%',
    height: '65%',
    color: theme.palette.background.emphasized,
  },
}));

/**
 * Stands in for a gallery image that failed to load, like the placeholder on the product page.
 * @returns The placeholder.
 */
const Placeholder = () => {
  const { classes } = useStyles();
  const src = useSelector(getProductImagePlaceholder) as string | null;

  if (src) {
    return <ProductImagePlaceholder src={src} noBackground />;
  }

  return (
    <div aria-hidden className={classes.root} data-test-id="placeHolder">
      <PlaceholderIcon className={classes.icon} />
    </div>
  );
};

export default Placeholder;
