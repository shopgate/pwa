/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';

/**
 * The Cart Product Properties component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Properties = ({ properties }) => (
  <Grid.Item>
    <ul>
      {properties.map(({ label, value }) =>
        <li key={`${label}-${value}`}>
          {label}: {value}
        </li>
      )}
    </ul>
    <div dangerouslySetInnerHTML={{ __html: '&nbsp;' }} />
  </Grid.Item>
);

Properties.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

Properties.defaultProps = {
  properties: [],
};

export default Properties;
