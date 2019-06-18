import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_DEFAULT_BEFORE,
  APP_BAR_DEFAULT,
  APP_BAR_DEFAULT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { withRoute } from '@shopgate/engage/core';
import { ViewContext } from 'Components/View/context';
import ProgressBar from './components/ProgressBar';
import connect from './connector';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    setFocus: PropTypes.bool.isRequired,
    'aria-hidden': PropTypes.bool,
    below: PropTypes.node,
    title: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': null,
    below: null,
    title: null,
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
    let { target } = this.state;

    if (!target) {
      target = document.getElementById('AppHeader');
      this.setState({ target: target || null }); // eslint-disable-line react/no-did-mount-set-state
    }

    if (this.props.setFocus) {
      // Set the focus to the first focusable element for screen readers.
      const focusable = target.querySelector('button:not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])');

      if (focusable) {
        focusable.focus();
      }
    }
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.route.visible || !this.state.target) {
      return null;
    }

    const { __ } = this.context.i18n();
    const center = <AppBar.Title title={__(this.props.title || '')} />;
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
          <AppBar center={center} {...this.props} below={below} aria-hidden={this.props['aria-hidden']} />
        </Portal>
        <Portal name={APP_BAR_DEFAULT_AFTER} />
      </Fragment>,
      this.state.target
    );
  }
}

/**
 * The AppBarDefaultWithContext component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarDefaultWithContext = props => (
  <ViewContext.Consumer>
    {({ ariaHidden }) => (
      <AppBarDefault {...props} aria-hidden={ariaHidden} />
      )}
  </ViewContext.Consumer>
);

export default withRoute(connect(AppBarDefaultWithContext), { prop: 'route' });
