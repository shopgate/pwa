import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import * as portals from '@shopgate/engage/core';
import { NoResults } from '@shopgate/engage/components';
import connect from './connector';

/**
 * The Empty component for the Category.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Empty = ({ isVisible, ...props }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Fragment>
      <Portal name={portals.NO_RESULTS_CONTENT_BEFORE} />
      <Portal name={portals.NO_RESULTS_CONTENT}>
        <NoResults {...props} />
      </Portal>
      <Portal name={portals.NO_RESULTS_CONTENT_AFTER} />
    </Fragment>
  );
};

Empty.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default connect(Empty);
