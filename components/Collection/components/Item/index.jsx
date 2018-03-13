import React from 'react';
import PropTypes from 'prop-types';

/**
 * The collection element component renders the inner elements of the collection
 * and appends properties for the current element index in the collection and an
 * indicator whether this is the first/last element or not.
 * @param {Object} props The component props.
 * @param {number} props.elementIndex The index of the current element.
 * @param {boolean} props.isFirstElement Indicates that this is the first collection element.
 * @param {boolean} props.isLastElement Indicates that this is the last collection element.
 * @param {string} props.elementIndexProp The name of the index property.
 * @param {string} props.lastElementProp The name of the prop identifying the last child.
 * @returns {JSX}
 */
const CollectionItem = (props) => {
  const { elementIndexProp, firstElementProp, lastElementProp } = props;
  const elementProps = {};

  if (elementIndexProp) {
    // Add the 'index' prop if required.
    elementProps[elementIndexProp] = props.elementIndex;
  }

  if (firstElementProp) {
    // Add the 'is first element' prop if required.
    elementProps[firstElementProp] = props.isFirstElement;
  }

  if (lastElementProp) {
    // Add the 'is last element' prop if required.
    elementProps[lastElementProp] = props.isLastElement;
  }

  // Return the inner element with the additional properties set above.
  return React.cloneElement(props.element, elementProps);
};

CollectionItem.propTypes = {
  elementIndex: PropTypes.number.isRequired,
  isFirstElement: PropTypes.bool.isRequired,
  isLastElement: PropTypes.bool.isRequired,
  elementIndexProp: PropTypes.string,
  lastElementProp: PropTypes.string,
};

CollectionItem.defaultProps = {
  elementIndexProp: null,
  lastElementProp: null,
};

export default CollectionItem;
