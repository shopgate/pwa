import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { RouteContext } from '@virtuous/react-conductor/Router';
import { ProgressBar as BaseProgressBar } from '@shopgate/pwa-ui-shared';

/**
 * The theme progress bar component.
 */
class ProgressBar extends PureComponent {
  static propTypes = {
    pattern: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    visible: false,
  };

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
   * @param {string} routePattern The route pattern.
   */
  handleShow = (routePattern) => {
    const { pattern } = this.props;

    if (routePattern === pattern) {
      this.setState({ show: true });
    }
  }

  /**
   * @param {string} routePattern The route pattern.
   */
  handleHide = (routePattern) => {
    const { pattern } = this.props;

    if (routePattern === pattern) {
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
