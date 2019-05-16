import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import Item from '../SheetItem';

/**
 * The CategorySheet component.
 */
class CategorySheet extends PureComponent {
  static propTypes = {
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

  static defaultProps = {
    onClose() {},
    onSelect() {},
    selectedId: null,
  };

  /**
   * Click handler for sheet items.
   * @param {Object} event The event object.
   */
  handleItemClick = (event) => {
    event.stopPropagation();
    this.props.onSelect(event.target.value);
  }

  /**
   * Render method of the component.
   * @return {JSX}
   */
  render() {
    const {
      items, label, onClose, open, selectedId,
    } = this.props;

    return (
      <SheetDrawer title={label} isOpen={open} onClose={onClose}>
        <SheetList>
          {items.map(item => (
            <Item
              item={item}
              key={item.id}
              onClick={this.handleItemClick}
              selected={item.id === selectedId}
            />
          ))}
        </SheetList>
      </SheetDrawer>
    );
  }
}

export default CategorySheet;
