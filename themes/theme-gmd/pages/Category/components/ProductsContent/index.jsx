import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import { RouteContext, DEFAULT_SORT } from '@shopgate/engage/core';
import {
  PRODUCT_LIST,
  PRODUCT_LIST_AFTER,
  PRODUCT_LIST_BEFORE,
} from '@shopgate/engage/category';
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
              {hasProducts && <Products
                categoryId={categoryId}
                filters={state.filters}
                sort={query.sort || DEFAULT_SORT}
                routeId={routeId}
              />}
            </Portal>
            <Portal name={PRODUCT_LIST_AFTER} props={portalProps} />
          </Fragment>
        )}
      </RouteContext.Consumer>
    );
  }
}

export default ProductsContent;
