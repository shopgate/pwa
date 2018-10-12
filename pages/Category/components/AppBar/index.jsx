import React from 'react';
import PropTypes from 'prop-types';
import { DefaultBar } from 'Components/AppBar/presets';
import Bar from '../Bar';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
function CategoryAppBar({ hasChildren, hasProducts, title }) {
  return (
    <DefaultBar
      title={title}
      {...(!hasChildren && hasProducts) && { below: <Bar /> }}
    />
  );
}

CategoryAppBar.propTypes = {
  hasChildren: PropTypes.bool.isRequired,
  hasProducts: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

CategoryAppBar.defaultProps = {
  title: '',
};

export default connect(CategoryAppBar);
