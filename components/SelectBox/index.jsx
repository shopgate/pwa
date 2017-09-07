/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import Dropdown from '../Dropdown';
import I18n from '../I18n';
import SelectBoxItem from './components/Item';
import styles from './style';

/**
 * The select box component.
 */
class SelectBox extends Component {
  static propTypes = {
    icon: PropTypes.func.isRequired,
    item: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string,
    classNames: PropTypes.objectOf(PropTypes.string),
    defaultText: PropTypes.string,
    duration: PropTypes.number,
    handleSelectionUpdate: PropTypes.func,
    initialValue: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    classNames: {},
    duration: 225,
    defaultText: 'filter.sort.default',
    handleSelectionUpdate: () => {},
    initialValue: null,
  };

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    this.dropdownCompleted = false;
    this.state = {
      isOpen: false,
      selected: find(props.items, { value: props.initialValue }),
    };
  }

  /**
   * Reset selected when changing the initial value.
    * @param {Object} nextProps The next props the component will receive.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.initialValue !== nextProps.initialValue) {
      this.setState({
        selected: find(nextProps.items, { value: nextProps.initialValue }),
      });
    }
  }

  /**
   * When dropdown animation is finished.
   */
  onDropdownComplete = () => {
    this.dropdownCompleted = true;
  };

  /**
   * Handles any interaction the user does outside of the component.
   * In this case the select gets closed.
   * @param {Object} event The event object.
   */
  handleInteractionOutside = (event) => {
    this.setState({
      isOpen: false,
    });

    event.preventDefault();
    event.stopPropagation();
  };

  /**
   * Sets the open state to true
   */
  handleOpenList = () => {
    if (this.state.isOpen) {
      return;
    }

    this.dropdownCompleted = false;
    this.setState({
      isOpen: true,
    });
  };

  /**
   * Sets the new active selection.
   * @param {string} value Value of the selected item.
   */
  handleSelectionUpdate = (value) => {
    const selection = find(this.props.items, { value });

    this.setState({
      selected: selection,
      isOpen: false,
    });

    // Delay the callback to make sure actions are fired after animations are done.
    setTimeout(() => {
      this.props.handleSelectionUpdate(selection.value);
    }, this.props.duration);
  };

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    const Icon = this.props.icon;
    const { icon, selection, button, dropdown, selectItem } = this.props.classNames;

    return (
      <div className={this.props.className}>
        <button className={button} onClick={this.handleOpenList}>
          <span className={selection}>
            {this.state.selected ? (
              <I18n.Text string={this.state.selected.label} />
            ) : (
              <I18n.Text string={this.props.defaultText} />
            )}
          </span>
          {this.state.isOpen ?
            <div className={`${icon} ${styles.rotatedIcon}`}><this.props.icon /></div> :
            <div className={icon}><Icon /></div>
          }
        </button>
        <Dropdown
          className={dropdown}
          isOpen={this.state.isOpen}
          onComplete={this.onDropdownComplete}
          duration={this.props.duration}
        >
          <div>
            {this.props.items.map(item => (
              <SelectBoxItem
                className={selectItem}
                wrapper={this.props.item}
                key={item.value}
                value={item.value}
                label={item.label}
                handleSelectionUpdate={this.handleSelectionUpdate}
              />
            ))}
          </div>
        </Dropdown>
        {this.state.isOpen &&
          <button
            className={styles.overlay}
            onClick={this.handleInteractionOutside}
            onTouchMove={this.handleInteractionOutside}
          />
        }
      </div>
    );
  }
}

export default SelectBox;
