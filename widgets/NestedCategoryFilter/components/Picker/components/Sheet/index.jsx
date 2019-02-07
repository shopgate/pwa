import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '@shopgate/pwa-common/context';
import List from 'Components/List';
import Item from '../SheetItem';

/**
 * The CategorySheet component.
 */
class CategorySheet extends PureComponent {
  static contextType = ThemeContext;

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
    const { Drawer } = this.context;
    const {
      items, label, onClose, open, selectedId,
    } = this.props;

    return (
      <Drawer title={label} isOpen={open} onClose={onClose}>
        <List>
          {items.map(item => (
            <Item
              item={item}
              key={item.id}
              onClick={this.handleItemClick}
              selected={item.id === selectedId}
            />
          ))}
        </List>
      </Drawer>
    );
  }
}

export default CategorySheet;
