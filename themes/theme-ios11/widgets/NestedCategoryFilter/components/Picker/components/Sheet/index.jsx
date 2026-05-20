import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import Item from '../SheetItem';

/**
 * The CategorySheet component.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
const CategorySheet = ({
  items,
  label,
  open,
  onClose,
  onSelect,
  selectedId,
}) => {
  const handleItemClick = useCallback((event) => {
    event.stopPropagation();
    onSelect(event.target.value);
  }, [onSelect]);

  return (
    <SheetDrawer title={label} isOpen={open} onClose={onClose}>
      <SheetList>
        {items.map(item => (
          <Item
            item={item}
            key={item.id}
            onClick={handleItemClick}
            selected={item.id === selectedId}
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
  onClose() {},
  onSelect() {},
  selectedId: null,
};

export default CategorySheet;
