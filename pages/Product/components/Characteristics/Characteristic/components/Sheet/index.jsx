import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Sheet from '@shopgate/pwa-ui-shared/Sheet';
import List from 'Components/List';
import SheetItem from '../SheetItem';

const portals = document.getElementById('portals');

/**
 * The characteristic sheet.
 */
class CharacteristicSheet extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    label: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    selectedValue: PropTypes.string,
  };

  static defaultProps = {
    onClose() {},
    onSelect() {},
    selectedValue: null,
  };

  /**
   * @param {Object} event The event object.
   */
  handleItemClick = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.props.onSelect(event.target.value);
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      items,
      label,
      onClose,
      open,
      selectedValue,
    } = this.props;

    const sheet = (
      <Sheet title={label} isOpen={open} onClose={onClose}>
        <List>
          {items.map(item => (
            <SheetItem
              item={item}
              key={item.id}
              onClick={this.handleItemClick}
              selected={item.id === selectedValue}
            />
          ))}
        </List>
      </Sheet>
    );

    return ReactDOM.createPortal(
      sheet,
      portals
    );
  }
}

export default CharacteristicSheet;
