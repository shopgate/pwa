import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import Item from '../SheetItem';

/**
 * The CategorySheet component.
 * @param {Object} props The component props.
 * @param {Array} props.items The list of items to display.
 * @param {string} props.label The sheet label.
 * @param {boolean} props.open Whether the sheet is open.
 * @param {Function} props.onClose The close handler.
 * @param {Function} props.onSelect The selection handler.
 * @param {string} props.selectedId The currently selected item id.
 * @return {JSX.Element}
 */
const CategorySheet = ({
  items, label, onClose, open, selectedId, onSelect,
}) => {
  const handleItemClick = useCallback((event) => {
    event.stopPropagation();
    onSelect(event.target.value);
  }, [onSelect]);

  return (
    <SheetDrawer title={label} isOpen={open} onClose={onClose}>
      <SheetList className="widget__nested-category-filter__sheet-list">
        {items.map(item => (
          <Item
            item={item}
            key={item.id}
            onClick={handleItemClick}
            isSelected={item.id === selectedId}
          />
        ))}
      </SheetList>
    </SheetDrawer>
  );
};

CategorySheet.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  label: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selectedId: PropTypes.string,
};

CategorySheet.defaultProps = {
  onClose: () => {},
  onSelect: () => {},
  selectedId: null,
};

export default CategorySheet;
