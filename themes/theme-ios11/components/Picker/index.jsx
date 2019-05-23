import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Picker } from '@shopgate/engage/components';
import { Sheet } from '@shopgate/engage/components';
import { SheetList } from '@shopgate/engage/components';
import Button from './components/Button';
import styles from './style';

/**
 * The template version of the Picker component.
 * @param {Object} props The same component props as in the base Picker component.
 */
class Picker extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    buttonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    buttonProps: PropTypes.shape(),
    clickDelay: PropTypes.number,
    hasButton: PropTypes.bool,
    sheetProps: PropTypes.shape(),
  };

  static defaultProps = {
    buttonComponent: null,
    buttonProps: {},
    /**
     * Time in ms that delays picker interaction in order
     * to let animations complete first.
     */
    clickDelay: 150,
    hasButton: true,
    sheetProps: {},
  };

  /**
   * Constructor
   * @param {Object} props Props of the component
   */
  constructor(props) {
    super(props);

    this.domElement = null;
    this.modalComponent = sheetProps => (
      <Sheet
        {...{
          ...this.props.sheetProps,
          ...sheetProps,
        }}
        title={this.props.label}
      />
    );
    this.listComponent = ({
      items, onSelect, selectedIndex, onClose,
    }) => (
        <SheetList>
          {items.map((item, index) => (
            <SheetList.Item
              key={item.value}
              title={item.label}
              onClick={() => {
                setTimeout(() => {
                  onSelect(item.value);
                  onClose();
                }, this.props.clickDelay);
              }}
              isDisabled={item.disabled}
              isSelected={index === selectedIndex}
              rightComponent={item.rightComponent}
              testId={item.label}
            />
          ))}
        </SheetList>
      );
  }

  /**
   * Render
   * @returns {JSX}
   */
  render() {
    const { hasButton, sheetProps: ignore, ...restProps } = this.props;
    return (
      <BasePicker
        {...restProps}
        className={hasButton ? styles : ''}
        modalComponent={this.modalComponent}
        buttonProps={this.props.buttonProps}
        buttonComponent={this.props.buttonComponent || Button}
        listComponent={this.listComponent}
        ref={(element) => { this.domElement = element ? element.domElement : null; }}
      />
    );
  }
}

export default Picker;
