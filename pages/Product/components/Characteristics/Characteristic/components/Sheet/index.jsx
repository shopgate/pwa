import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Sheet from '@shopgate/pwa-ui-shared/Sheet';
import List from 'Components/List';
import styles from './style';

const portals = document.getElementById('portals');

/**
 * 
 */
class CharacteristicSheet extends Component {

  handleItemClick = (event) => {
    event.stopPropagation();
    this.props.selectCharacteristic(event.target.value);
  }

  /**
   * 
   */
  render() {
    const { items, label, open } = this.props;

    const sheet = (
      <Sheet title={label} isOpen={open}>
        <List>
          {items.map((item) => {
            const classes = classNames(
              styles.button,
              { [styles.buttonDisabled]: !item.selectable }
            );

            const props = {
              className: classes,
              key: item.id,
              value: item.id,
              ...item.selectable && { onClick: this.handleItemClick },
            };

            return (
              <button {...props}>
                {item.label}
              </button>
            );
          })}
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
