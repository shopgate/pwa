import React from 'react';
import PropTypes from 'prop-types';
import { BackBar } from 'Components/AppBar/presets';
import connect from './connector';

/**
 * The CategoryAppBar component.
 * @returns {JSX}
 */
function CategoryAppBar({ title }) {
  return (
    <BackBar
      title={title}
    />
  );
}

CategoryAppBar.propTypes = {
  title: PropTypes.string,
};

CategoryAppBar.defaultProps = {
  title: '',
};

export default connect(CategoryAppBar);
