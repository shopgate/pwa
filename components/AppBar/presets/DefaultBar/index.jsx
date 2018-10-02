import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { AppBar, NavDrawer } from '@shopgate/pwa-ui-material';
import { BurgerIcon } from '@shopgate/pwa-ui-shared';
import CartButton from './components/CartButton';
import SearchButton from './components/SearchButton';
import ProgressBar from './components/ProgressBar';

/**
 * @param {Object} props the component props.
 * @param {Object} context the component context.
 * @returns {JSX}
 */
function AppBarDefault({ title, ...props }, context) {
  const { __ } = context.i18n();
  const left = <AppBar.Icon icon={BurgerIcon} onClick={NavDrawer.open} />;
  const center = <AppBar.Title title={__(title || '')} />;
  const right = (
    <Fragment>
      <SearchButton />
      <CartButton />
    </Fragment>
  );
  const below = (
    <Fragment>
      {props.below}
      <ProgressBar />
    </Fragment>
  );

  return <AppBar left={left} center={center} right={right} {...props} below={below} />;
}

AppBarDefault.propTypes = {
  title: PropTypes.string,
};

AppBarDefault.defaultProps = {
  title: null,
};

AppBarDefault.contextTypes = {
  i18n: PropTypes.func,
};

export default AppBarDefault;
