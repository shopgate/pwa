import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/constants/Portals';
import NoResults from '@shopgate/pwa-ui-shared/NoResults';
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
