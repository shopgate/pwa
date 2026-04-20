import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@shopgate/pwa-common/context';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { TaggedLogger } from '../helpers';

const logger = new TaggedLogger('withPageProductId');

/**
 * Reads productId from params and tries to hex2bin decode it.
 * @param {Object} params Params.
 * @returns {string|null|false}
 */
function decodeProductIdFromParams(params) {
  let decodedProductId = null;
  if (typeof params.productId === 'undefined') {
    const message = 'Connector is probably rendered outside of page containing "productId" pattern param. Please check documentation for more information: https://github.com/shopgate-professional-services/pwa-extension-kit/blob/master/src/data/connectors/README.md#withPageProductId';
    logger.error(message);

    return decodedProductId;
  }

  decodedProductId = hex2bin(params.productId);

  if (params.productId && !decodedProductId) {
    logger.warn('Wrapping with empty productId. Possibly productId used in a pathname is not bin2hex encoded.');
  }

  return decodedProductId;
}
// eslint-disable-next-line react/prefer-stateless-function, require-jsdoc
class WithPageProductId extends Component {
  static propTypes = {
    WrappedComponent: PropTypes.func.isRequired,
  };

  /**
   * @inheritDoc
   */
  render() {
    const { WrappedComponent, ...otherProps } = this.props;

    return (
      <RouteContext.Consumer>
        { ({ params }) =>
          <WrappedComponent productId={decodeProductIdFromParams(params)} {...otherProps} />
        }
      </RouteContext.Consumer>
    );
  }
}

/**
 * Returns a Wrapped Component with automatic props.productId read from RouteContext.
 * @param {Function} WrappedComponent Component which will be wrapped with data connector.
 * @returns {Function} React component.
 */
const withPageProductId = WrappedComponent => props =>
  <WithPageProductId WrappedComponent={WrappedComponent} {...props} />;

export default withPageProductId;
