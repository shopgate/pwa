import React from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import FilterContent from './components/Content';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Filter = ({ id, search }) => (
  <View>
    {(id || search) && <FilterContent categoryId={id} s={search} />}
  </View>
);

Filter.propTypes = {
  id: PropTypes.string,
  search: PropTypes.string,
};

Filter.defaultProps = {
  id: null,
  search: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params, query }) => (
      <Filter id={hex2bin(params.categoryId) || null} search={query.s || null} />
    )}
  </RouteContext.Consumer>
);
