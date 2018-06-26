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
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    onSelect() {},
  };

  /**
   * @param {Object} event The event object.
   */
  handleItemClick = (event) => {
    event.stopPropagation();
    this.props.onSelect(event.target.value);
  }

  /**
   * @return {JSX}
   */
  render() {
    const { items, label, open } = this.props;

    const sheet = (
      <Sheet title={label} isOpen={open}>
        <List>
          {items.map(item => (
            <SheetItem key={item.id} item={item} onClick={this.handleItemClick} />
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
