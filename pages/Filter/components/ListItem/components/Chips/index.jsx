/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import ChipsLayout from 'Components/ChipsLayout';
import Chip from 'Components/Chip';

/**
 * The Filter List Item Chips component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Chips = pure(({ values }) => {
  if (!values || (values && values.length !== 0)) {
    return null;
  }

  return (
    <ChipsLayout maxRows={3} moreLabel="filter.view_all" invertMoreButton>
      {values.map(value => (
        <Chip invert removable={false} key={value}>
          {value}
        </Chip>
      ))}
    </ChipsLayout>
  );
});

Chips.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape()),
};

Chips.defaultProps = {
  values: null,
};

export default Chips;
