import type { ReactElement } from 'react';
import ProductCardPlaceholder from '../ProductCard/ProductCardPlaceholder';
import Layout from './components/Layout';
import { useProductGridColumns } from './hooks';

/**
 * Props of the {@link ProductGridPlaceholder} component.
 */
export interface ProductGridPlaceholderProps {
  /**
   * The number of placeholder tiles.
   */
  count: number;
  /**
   * Which product details the tiles show, as the product grid takes them.
   */
  flags: {
    name: boolean;
    price: boolean;
  };
  /**
   * Class name of the grid.
   */
  className?: string;
}

/**
 * Stands in for a product grid while its products load.
 */
const ProductGridPlaceholder = ({
  count,
  flags,
  className,
}: ProductGridPlaceholderProps): ReactElement => {
  const columns = useProductGridColumns();

  return (
    <div aria-hidden className="engage__product-grid__placeholder">
      <Layout columns={columns} className={className}>
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <ProductCardPlaceholder variant="tile" hideName={!flags.name} hidePrice={!flags.price} />
          </li>
        ))}
      </Layout>
    </div>
  );
};

export default ProductGridPlaceholder;
