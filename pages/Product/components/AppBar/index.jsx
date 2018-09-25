import React from 'react';
import PropTypes from 'prop-types';
import { DefaultBar } from 'Components/AppBar/presets';
import connect from './connector';

/**
 * The ProductAppBar component.
 * @returns {JSX}
 */
function ProductAppBar({ title }) {
  return (
    <DefaultBar title={title} />
  );
}

ProductAppBar.propTypes = {
  title: PropTypes.string,
};

ProductAppBar.defaultProps = {
  title: '',
};

export default connect(ProductAppBar);
