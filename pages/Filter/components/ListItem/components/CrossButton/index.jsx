import React from 'react';
import PropTypes from 'prop-types';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';
import styles from './style';
import connect from './connector';

/**
 * The Cross Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const CrossButton = ({ removeTemporaryFilter }) => (
  <button className={styles.cross} onClick={removeTemporaryFilter}>
    <CrossIcon className={styles.crossIcon} />
  </button>
);

CrossButton.propTypes = {
  removeTemporaryFilter: PropTypes.func.isRequired,
};

export default connect(CrossButton);
