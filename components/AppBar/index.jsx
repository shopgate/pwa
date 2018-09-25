import React, { PureComponent } from 'react';
import { AppBar } from '@shopgate/pwa-ui-material';
import { ViewContext } from 'Components/View/context';

/**
 * The AppBarContainer component.
 */
class AppBarContainer extends PureComponent {
  /**
   * @param {Object} node The ref of the AppBar.
   */
  onMount = (node) => {
    this.props.setTop(node.current.clientHeight);
  }

  ref = React.createRef();

  /**
   * @returns {JSX}
   */
  render() {
    const Bar = React.forwardRef((props, ref) => (
      <AppBar {...props} forwardRef={ref} />
    ));

    return (
      <Bar {...this.props} onMount={this.onMount} ref={this.ref} />
    );
  }
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarConsumer = props => (
  <ViewContext.Consumer>
    {({ setTop }) => <AppBarContainer {...props} setTop={setTop} />}
  </ViewContext.Consumer>
);

AppBarConsumer.Icon = AppBar.Icon;
AppBarConsumer.Title = AppBar.Title;

export default AppBarConsumer;
