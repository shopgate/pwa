import React from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import { RouteContext } from '@shopgate/engage/core';
import PageContent from './components/Content';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Page = ({ id }) => (
  <View>
    <PageContent pageId={id} />
  </View>
);

Page.propTypes = {
  id: PropTypes.string,
};

Page.defaultProps = {
  id: null,
};

export default () => (
  <RouteContext.Consumer>
    {({ params }) => (
      <Page id={params.pageId || null} />
    )}
  </RouteContext.Consumer>
);
