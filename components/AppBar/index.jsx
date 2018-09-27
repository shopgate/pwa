import React, { PureComponent } from 'react';
import { AppBar } from '@shopgate/pwa-ui-material';

/**
 * The AppBarContainer component.
 */
class AppBarContainer extends PureComponent {

  ref = React.createRef();

  /**
   * @returns {JSX}
   */
  render() {
    const Bar = React.forwardRef((props, ref) => (
      <AppBar {...props} forwardRef={ref} />
    ));

    return (
      <Bar {...this.props} ref={this.ref} />
    );
  }
}

AppBarContainer.Icon = AppBar.Icon;
AppBarContainer.Title = AppBar.Title;

export default AppBarContainer;
