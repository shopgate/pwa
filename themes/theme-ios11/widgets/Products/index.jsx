import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showInventoryInLists } from '@shopgate/engage/locations/helpers';
import ProductsIdsWidget from './ProductsIdsWidget';
import ProductsWidget from './ProductsWidget';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  hasInventoryInLists: showInventoryInLists(state),
});

/**
 * @param {Object} settings .
 * @param {Object} props .
 * @returns {JSX}
 */
const ProductsWidgets = ({ settings, hasInventoryInLists, ...props }) => {
  const { queryType } = settings;

  /** @type {ProductsWidget} */
  const TypeRenderer = useMemo(() => {
    if (queryType === 4 && !hasInventoryInLists) {
      return ProductsIdsWidget;
    }

    return ProductsWidget;
  }, [queryType, hasInventoryInLists]);

  return (
    <TypeRenderer settings={settings} {...props} />
  );
};

ProductsWidgets.propTypes = {
  settings: PropTypes.shape().isRequired,
  hasInventoryInLists: PropTypes.bool,
};

ProductsWidgets.defaultProps = {
  hasInventoryInLists: false,
};

export default connect(mapStateToProps)(ProductsWidgets);
