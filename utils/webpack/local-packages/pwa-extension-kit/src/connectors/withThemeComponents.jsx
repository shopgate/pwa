import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@shopgate/pwa-common/context';

/**
 * WithThemeComponents component.
 */
// eslint-disable-next-line react/prefer-stateless-function, require-jsdoc
class WithThemeComponents extends Component {
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
          const { contexts, ...components } = props;

          return (
            <WrappedComponent
              {...components}
              {...otherProps}
            />
          );
        }}
      </Theme>
    );
  }
}

export default WrappedComponent => props =>
  <WithThemeComponents WrappedComponent={WrappedComponent} {...props} />;
