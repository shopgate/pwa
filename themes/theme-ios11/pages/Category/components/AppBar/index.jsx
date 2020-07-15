import React from 'react';
import PropTypes from 'prop-types';
import { BackBar } from 'Components/AppBar/presets';
import Bar from '../Bar';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
function CategoryAppBar({ hasChildren, hasProducts, title }) {
  return (
    <BackBar
      title={title}
      below={<Bar hasChildren={hasChildren} hasProducts={hasProducts} />}
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
