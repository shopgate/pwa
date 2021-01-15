import { UnwrappedProductsWidget } from './ProductsWidget';
import connect from './connector';

/**
 * The product ids widget component.
 */
class ProductsIdsWidget extends UnwrappedProductsWidget {
  /**
   * @inheritDoc
   */
  constructor(props, context) {
    super(props, context);

    const { productLimit } = props.settings;
    this.productCount = productLimit;
  }

  /**
   * @inheritDoc
   */
  componentDidMount() {
    // Always fetch by product ids
    this.getProducts();
  }

  /**
   * @inheritDoc
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    super.UNSAFE_componentWillReceiveProps(nextProps);

    const { productLimit } = this.props.settings;
    this.productCount = productLimit;
  }

  /**
   * @inheritDoc
   */
  handleClickMore = () => {
    if (this.hasAllProducts()) {
      return;
    }
    const { productLimit } = this.props.settings;
    this.productCount += productLimit;

    this.forceUpdate();
  };

  /**
   * Render More button predicate
   * @inheritDoc
   */
  hasAllProducts = () => this.productCount >= this.props.products.length;
}

export default connect(ProductsIdsWidget);
