import React from 'react';
import PropTypes from 'prop-types';
import { RouteContext } from '@virtuous/react-conductor/Router';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import View from 'Components/View';
import Content from './components/Content';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FilterAttribute = ({ url }) => (
  <View>
    {url && <Content url={url} />}
  </View>
);

FilterAttribute.propTypes = {
  url: PropTypes.string,
};

FilterAttribute.defaultProps = {
  url: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <FilterAttribute url={params.attribute ? `${FILTER_PATH}/${params.attribute}` : null} />
    )}
  </RouteContext.Consumer>
);
