import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import PropertyRows from './components/PropertyRows';
import connect from './connector';

/**
 * The Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX|null}
 */
const Properties = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className={styles.content}>
      <table className={styles.table}>
        <tbody>
          <PropertyRows properties={properties} />
        </tbody>
      </table>
    </div>
  );
};

Properties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape()),
};

Properties.defaultProps = {
  properties: null,
};

export default connect(Properties);
