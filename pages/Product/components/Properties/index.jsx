/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';
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
          {properties.map(({ label, value }) => (
            <tr key={label}>
              <td className={styles.cell}>{label}</td>
              <td className={styles.cell}>{value}</td>
            </tr>
          ))}
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
