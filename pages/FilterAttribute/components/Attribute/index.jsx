/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';

/**
 * The Filter Attribute component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Attribute = ({ children }) => {
  if (!children || !Children.count(children)) {
    return null;
  }

  return (
    <List>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          return null;
        }

        return (
          <List.Item isSelected={child.props.isSelected} key={`filter-${index}`}>
            {child}
          </List.Item>
        );
      })}
    </List>
  );
};

Attribute.propTypes = {
  children: PropTypes.node,
};

Attribute.defaultProps = {
  children: null,
};

export default Attribute;
