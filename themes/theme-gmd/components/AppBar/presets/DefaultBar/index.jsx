import React, { Fragment, Component } from 'react';
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
  APP_BAR_DEFAULT,
} from '@shopgate/pwa-common/constants/Portals';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
import ProgressBar from './components/ProgressBar';

/**
 * The AppBarDefault component.
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const AppBarDefault = (props, context) => {
  const { __ } = context.i18n();
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
        <AppBar.Title title={__(props.title || '')} />
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
      {props.below}
      <ProgressBar />
    </Fragment>
  );

  /**
   * @param {Object} barProps The component props.
   * @returns {JSX}
   */
  const Bar = barProps => <AppBar left={left} center={center} right={right} {...this.props} {...barProps} below={below} />;

  return (
    <Portal name={APP_BAR_DEFAULT} props={{ AppBar: Bar }}>
      <Bar />
    </Portal>
  );
};

AppBarDefault.propTypes = {
  below: PropTypes.node,
  title: PropTypes.string,
};

AppBarDefault.defaultProps = {
  title: null,
  below: null,

};

AppBarDefault.contextTypes = {
  i18n: PropTypes.func,
};

export default AppBarDefault;
