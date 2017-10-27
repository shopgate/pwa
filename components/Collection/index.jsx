/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Item from './components/Item';

/**
 * The collection component.
 * @param {Object} props The component props.
 * @param {React.Node} props.children The collections child components.
 * @param {string} props.className The style for the container.
 * @param {string} props.container The tag type of the container.
 * @param {string} props.elementIndexProp The name of the elements index prop.
 * @param {string} props.firstElementProp The indicator prop whether this is the first element.
 * @param {string} props.lastElementProp The indicator prop whether this the last element.
 * @returns {JSX}
 */
const Collection = (props) => {
  const { elementIndexProp, firstElementProp, lastElementProp } = props;
  const elements = React.Children.map(props.children, (element, index) => (
    <Item
      element={element}
      elementIndexProp={elementIndexProp}
      firstElementProp={firstElementProp}
      lastElementProp={lastElementProp}
      elementIndex={index}
      isFirstElement={index === 0}
      isLastElement={index === (React.Children.count(props.children) - 1)}
    />
  ));

  return React.createElement(props.container, { className: props.className }, elements);
};

Collection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  container: PropTypes.string,
  elementIndexProp: PropTypes.string,
  firstElementProp: PropTypes.string,
  lastElementProp: PropTypes.string,
};

Collection.defaultProps = {
  children: null,
  className: null,
  container: 'div',
  elementIndexProp: null,
  firstElementProp: null,
  lastElementProp: null,
};

Collection.Element = Item;

export default Collection;
