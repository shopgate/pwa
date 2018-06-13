import React from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import { RouteContext } from '@virtuous/react-conductor/Router';
import Content from './components/Content';

/**
 * The Search component.
 * @param {string} props.searchPhrase The search phrase.
 * @return {JSX}
 */
const Search = ({ searchPhrase }) => (
  <View>
    {searchPhrase && <Content searchPhrase={searchPhrase} />}
  </View>
);

Search.propTypes = {
  searchPhrase: PropTypes.string,
};

Search.defaultProps = {
  searchPhrase: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ query }) => (
      <Search searchPhrase={query.s || null} />
    )}
  </RouteContext.Consumer>
);
