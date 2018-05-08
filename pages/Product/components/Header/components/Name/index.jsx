import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import connect from './connector';
import styles from './style';

/**
 * The Product Name component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Name = ({ name }) => (
  <div className={styles.name}>
    <PlaceholderLabel className={styles.placeholder} ready={(name !== null)}>
      <span>{name}</span>
    </PlaceholderLabel>
  </div>
);

Name.propTypes = {
  name: PropTypes.string,
};

Name.defaultProps = {
  name: null,
};

export default connect(Name);
