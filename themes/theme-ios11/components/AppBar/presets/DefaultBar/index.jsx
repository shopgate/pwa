import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/engage/core';
import { AppBarIOS } from '@shopgate/pwa-ui-ios';
import { RouteContext } from '@shopgate/engage/core';
import ProgressBar from './components/ProgressBar';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    below: PropTypes.node,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    below: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  state = {
    target: document.getElementById('AppHeader'),
  }

  /**
   * Sets the target if it hasn't been set before.
   */
  componentDidMount() {
    if (!this.state.target) {
      const target = document.getElementById('AppHeader');
      this.setState({ target: target || null }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.visible || !this.state.target) {
      return null;
    }

    const { title } = this.props;
    const { __ } = this.context.i18n();
    const center = <AppBar.Title title={__(title || '')} />;
    const below = (
      <Fragment key="below">
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return ReactDOM.createPortal(
      <Fragment>
        <Portal name={APP_BAR_DEFAULT_BEFORE} />
        <Portal name={APP_BAR_DEFAULT}>
          <AppBar center={center} {...this.props} below={below} />
        </Portal>
        <Portal name={APP_BAR_DEFAULT_AFTER} />
      </Fragment>,
      this.state.target
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ visible }) => <AppBarDefault {...props} visible={visible} />}
  </RouteContext.Consumer>
);
