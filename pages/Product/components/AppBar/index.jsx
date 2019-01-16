import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { BackBar } from 'Components/AppBar/presets';
import CartButton from 'Components/AppBar/components/CartButton';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_RIGHT,
  APP_BAR_RIGHT_BEFORE,
  APP_BAR_RIGHT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import connect from './connector';

/**
 * The ProductAppBar component.
 * @returns {JSX}
 */
function ProductAppBar({ title }) {
  const right = (
    <Fragment key="right">
      <Portal name={APP_BAR_RIGHT_BEFORE} />
      <Portal name={APP_BAR_RIGHT}>
        <CartButton />
      </Portal>
      <Portal name={APP_BAR_RIGHT_AFTER} />
    </Fragment>
  );

  return (
    <BackBar title={title} right={right} />
  );
}

ProductAppBar.propTypes = {
  title: PropTypes.string,
};

ProductAppBar.defaultProps = {
  title: '',
};

export default connect(ProductAppBar);
