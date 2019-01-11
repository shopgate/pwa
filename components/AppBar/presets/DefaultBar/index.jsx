import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CENTER,
  APP_BAR_CENTER_BEFORE,
  APP_BAR_CENTER_AFTER,
  APP_BAR_DEFAULT,
} from '@shopgate/pwa-common/constants/Portals';
import { AppBar } from '@shopgate/pwa-ui-ios';
import ProgressBar from './components/ProgressBar';

/**
 * The AppBarDefault component.
 */
class AppBarDefault extends PureComponent {
  static propTypes = {
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

  target = document.getElementById('AppHeader');

  /**
   * @returns {JSX}
   */
  render() {
    const { title } = this.props;
    const { __ } = this.context.i18n();
    const center = (
      <Fragment key="center">
        <Portal name={APP_BAR_CENTER_BEFORE} />
        <Portal name={APP_BAR_CENTER}>
          <AppBar.Title title={__(title || '')} />
        </Portal>
        <Portal name={APP_BAR_CENTER_AFTER} />
      </Fragment>
    );
    const below = (
      <Fragment key="below">
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return ReactDOM.createPortal(
      <Portal name={APP_BAR_DEFAULT}>
        <AppBar center={center} {...this.props} below={below} />
      </Portal>,
      this.target
    );
  }
}

export default AppBarDefault;
