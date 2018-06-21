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
const Filter = ({ id }) => (
  <View>
    {id && <FilterContent categoryId={id} />}
  </View>
);

Filter.propTypes = {
  id: PropTypes.string,
};

Filter.defaultProps = {
  id: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <Filter id={hex2bin(params.categoryId) || null} />
    )}
  </RouteContext.Consumer>
);
