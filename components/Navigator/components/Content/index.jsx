import React from 'react';
import PropTypes from 'prop-types';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import connect from './connector';
import Logo from './components/Logo';
import Title from './components/Title';

/**
 * The navigator content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = (props) => {
  if (props.path === INDEX_PATH) {
    return <Logo />;
  }

  return <Title />;
};

Content.propTypes = {
  path: PropTypes.string.isRequired,
};

export default connect(Content);
