import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import { RouteContext } from '@shopgate/pwa-common/context';
import {
  PRODUCT_LIST,
  PRODUCT_LIST_AFTER,
  PRODUCT_LIST_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { Section } from '@shopgate/engage/a11y';
import Products from '../Products';

/**
 * The category products content component.
 */
class ProductsContent extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string.isRequired,
    hasProducts: PropTypes.bool,
  };

  static defaultProps = {
    hasProducts: false,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { categoryId, hasProducts } = this.props;
    const portalProps = { categoryId };

    return (
      <RouteContext.Consumer>
        {({ state, query, id: routeId }) => (
          <Fragment>
            <Portal name={PRODUCT_LIST_BEFORE} props={portalProps} />
            <Portal name={PRODUCT_LIST} props={portalProps}>
              {hasProducts && (
                <Section title="category.sections.products">
                  <Products
                    categoryId={categoryId}
                    filters={state.filters}
                    sort={query.sort || DEFAULT_SORT}
                    routeId={routeId}
                  />
                </Section>
              )}
            </Portal>
            <Portal name={PRODUCT_LIST_AFTER} props={portalProps} />
          </Fragment>
        )}
      </RouteContext.Consumer>
    );
  }
}

export default ProductsContent;
