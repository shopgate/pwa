import React, { Fragment, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_LEFT,
  APP_BAR_LEFT_BEFORE,
  APP_BAR_LEFT_AFTER,
  APP_BAR_CENTER,
  APP_BAR_CENTER_BEFORE,
  APP_BAR_CENTER_AFTER,
  APP_BAR_RIGHT,
  APP_BAR_RIGHT_BEFORE,
  APP_BAR_RIGHT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
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
    const left = (
      <Fragment key="left">
        <Portal name={APP_BAR_LEFT_BEFORE} />
        <Portal name={APP_BAR_LEFT}>
          <AppBar.Icon icon={BurgerIcon} onClick={NavDrawer.open} testId="Button" />
        </Portal>
        <Portal name={APP_BAR_LEFT_AFTER} />
      </Fragment>
    );
    const center = (
      <Fragment key="center">
        <Portal name={APP_BAR_CENTER_BEFORE} />
        <Portal name={APP_BAR_CENTER}>
          <AppBar.Title title={__(title || '')} />
        </Portal>
        <Portal name={APP_BAR_CENTER_AFTER} />
      </Fragment>
    );
    const right = (
      <Fragment key="right">
        <Portal name={APP_BAR_RIGHT_BEFORE} />
        <Portal name={APP_BAR_RIGHT}>
          <SearchButton />
          <CartButton />
        </Portal>
        <Portal name={APP_BAR_RIGHT_AFTER} />
      </Fragment>
    );
    const below = (
      <Fragment key="below">
        {this.props.below}
        <ProgressBar />
      </Fragment>
    );

    return ReactDOM.createPortal(
      <AppBar left={left} center={center} right={right} {...this.props} below={below} />,
      this.target
    );
  }
}

export default AppBarDefault;
