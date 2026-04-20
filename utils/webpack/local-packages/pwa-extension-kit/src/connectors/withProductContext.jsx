import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@shopgate/pwa-common/context';

/**
 * WithProductContext component.
 */
// eslint-disable-next-line react/prefer-stateless-function, require-jsdoc
class WithProductContext extends Component {
  static propTypes = {
    WrappedComponent: PropTypes.func.isRequired,
  };

  /**
   * @inheritDoc
   */
  render() {
    const { WrappedComponent, ...otherProps } = this.props;
    return (
      <Theme>
        {(props) => {
          const { contexts: { ProductContext } } = props;

          return (
            <ProductContext.Consumer>
              {productParams =>
                <WrappedComponent productContext={productParams} {...otherProps} />
              }
            </ProductContext.Consumer>
          );
        }}
      </Theme>
    );
  }
}

export default WrappedComponent => props =>
  <WithProductContext WrappedComponent={WrappedComponent} {...props} />;
