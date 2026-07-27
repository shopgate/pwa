import { ProductGrid } from '@shopgate/engage/product/components';
import { logger } from '@shopgate/engage/core/helpers';

let deprecationWarning =
  'Accessing ProductGrid via the theme API is deprecated. Import it directly:\n'
  + "import { ProductGrid } from '@shopgate/engage/product/components';";

/**
 * Logs the ProductGrid theme-API deprecation warning once.
 */
function triggerDeprecation() {
  if (deprecationWarning) {
    logger.warn(deprecationWarning);
    deprecationWarning = null;
  }
}

/**
 * Thin wrapper that exposes the engage ProductGrid through the theme API while
 * logging a one-shot deprecation warning steering consumers to the direct
 * import.
 * @deprecated Import `ProductGrid` from `@shopgate/engage/product/components`
 * instead of reading it from the theme API.
 * @param {Object} props The component props, forwarded to the engage ProductGrid.
 * @returns {JSX.Element}
 */
const DeprecatedProductGrid = (props) => {
  triggerDeprecation();

  return <ProductGrid {...props} />;
};

export default DeprecatedProductGrid;
