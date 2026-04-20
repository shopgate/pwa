import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LoadingContext } from '@shopgate/pwa-common/providers/';
import { RouteContext } from '@shopgate/pwa-common/context';

/**
 * WithPageState component.
 */
// eslint-disable-next-line react/prefer-stateless-function, require-jsdoc
class WithPageState extends Component {
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
        {({
            visible,
            pathname,
            pattern,
            location,
            state,
        }) => (
          <LoadingContext.Consumer>
            {({ isLoading }) => (
              <WrappedComponent
                isLoading={isLoading(pathname)}
                isVisible={visible}
                pathname={pathname}
                pattern={pattern}
                location={location}
                state={state}
                {...otherProps}
              />
            )}
          </LoadingContext.Consumer>
        )}
      </RouteContext.Consumer>
    );
  }
}

export default WrappedComponent => props =>
  <WithPageState WrappedComponent={WrappedComponent} {...props} />;
