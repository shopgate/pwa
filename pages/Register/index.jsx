import React, { PureComponent } from 'react';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import View from 'Components/View';

/**
 * The register view component.
 */
class Register extends PureComponent {
  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <View>
        <LoadingIndicator />
      </View>
    );
  }
}

export default Register;
