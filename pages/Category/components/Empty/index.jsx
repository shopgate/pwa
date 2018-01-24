/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import NoResults from 'Components/NoResults';
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
    <NoResults {...props} />
  );
};

Empty.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default connect(Empty);
