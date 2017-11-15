/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import SimpleInput from './components/SimpleInput';
import MultiLineInput from './components/MultiLineInput';

/**
 *
 * @param {Object} props Props
 * @return {JSX}
 */
const Factory = (props) => {
  if (props.multiLine) {
    return <MultiLineInput {...props} />;
  }
  return <SimpleInput {...props} />;
};

Factory.propTypes = {
  multiLine: PropTypes.bool,
};

Factory.defaultProps = {
  multiLine: false,
};

module.exports = props => Factory(props);
