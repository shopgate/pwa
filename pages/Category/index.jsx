import React from 'react';
import PropTypes from 'prop-types';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import CategoryContent from './components/Content';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Category = ({ id }) => (
  <View>
    {id && <CategoryContent categoryId={id} />}
  </View>
);

Category.propTypes = {
  id: PropTypes.string,
};

Category.defaultProps = {
  id: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <Category id={hex2bin(params.categoryId) || null} />
    )}
  </RouteContext.Consumer>
);

export { Category as UnwrappedCategory };
