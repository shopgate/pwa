import React, { PureComponent } from 'react';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { RouteContext } from '@virtuous/react-conductor/Router';
import { ProgressBar as BaseProgressBar } from '@shopgate/pwa-ui-shared';

/**
 * The theme progress bar component.
 */
class ProgressBar extends PureComponent {
  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    UIEvents.addListener(BaseProgressBar.PROGRESS_BAR_SHOW, this.handleShow);
    UIEvents.addListener(BaseProgressBar.PROGRESS_BAR_HIDE, this.handleHide);
  }

  /**
   * Removes the events listeners when the component unmounts.
   */
  componentWillUnmount() {
    UIEvents.removeListener(BaseProgressBar.PROGRESS_BAR_SHOW, this.handleShow);
    UIEvents.removeListener(BaseProgressBar.PROGRESS_BAR_HIDE, this.handleHide);
  }

  /**
   * @param {string} eventPattern The event pattern argument.
   */
  handleShow = (eventPattern) => {
    const { pattern } = this.props;

    if (eventPattern === pattern) {
      this.setState({ show: true });
    }
  }

  /**
   * @param {string} eventPattern The event pattern argument.
   */
  handleHide = (eventPattern) => {
    const { pattern } = this.props;

    if (eventPattern === pattern) {
      this.setState({ show: false });
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { show } = this.state;
    const { visible } = this.props;

    return (
      <BaseProgressBar isVisible={(show && visible)} />
    );
  }
}

export default () => (
  <RouteContext.Consumer>
    {({ visible, pattern }) => (
      <ProgressBar visible={visible} pattern={pattern} />
    )}
  </RouteContext.Consumer>
);
