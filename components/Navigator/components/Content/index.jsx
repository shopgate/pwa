import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import connect from './connector';
import Logo from './components/Logo';
import Title from './components/Title';
import Search from './components/Search';

/**
 * The navigator content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Content = (props) => {
  let currentTitle = null;

  if (!props.searchActive) {
    if (props.path === INDEX_PATH) {
      currentTitle = <Logo />;
    } else {
      const isSearching = props.searchQuery !== null;

      currentTitle = <Title onClick={isSearching ? props.submitSearch : null} />;
    }
  }

  return (
    <Fragment>
      {currentTitle}
      <Search active={props.searchActive} />
    </Fragment>
  );
};

Content.propTypes = {
  submitSearch: PropTypes.func.isRequired,
  path: PropTypes.string,
  searchActive: PropTypes.bool,
  searchQuery: PropTypes.string,
};

Content.defaultProps = {
  path: null,
  searchActive: false,
  searchQuery: null,
};

export default connect(Content);
