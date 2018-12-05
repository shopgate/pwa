import React from 'react';
import PropTypes from 'prop-types';
import { BackBar } from 'Components/AppBar/presets';
import CartButton from 'Components/AppBar/components/CartButton';
import connect from './connector';

/**
 * The ProductAppBar component.
 * @returns {JSX}
 */
function ProductAppBar({ title }) {
  return (
    <BackBar title={title} right={<CartButton key="right" />} />
  );
}

ProductAppBar.propTypes = {
  title: PropTypes.string,
};

ProductAppBar.defaultProps = {
  title: '',
};

export default connect(ProductAppBar);
