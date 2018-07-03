import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';
import Sheet from './components/Sheet';

/**
 * A single characteristic.
 */
class Characteristic extends Component {
  static propTypes = {
    charRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape(),
    ]).isRequired,
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selected: PropTypes.string,
  };

  static defaultProps = {
    selected: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  state = {
    sheet: false,
  };

  /**
   * @param {string} defaultLabel The default button label.
   * @return {string}
   */
  getButtonLabel = (defaultLabel) => {
    if (!this.props.selected) {
      return defaultLabel;
    }

    const value = this.props.values.find(val => val.id === this.props.selected);

    return value.label;
  }

  /**
   * @param {Object} event The event object.
   */
  handleButtonClick = (event) => {
    event.preventDefault();

    if (this.props.disabled) {
      return;
    }

    this.setState({
      sheet: true,
    });
  }

  /**
   * @param {string} valueId The ID of the selected value.
   */
  handleItemSelection = (valueId) => {
    this.props.select({
      id: this.props.id,
      value: valueId,
    });

    this.closeSheet();
  }

  closeSheet = () => {
    this.setState({
      sheet: false,
    });
  }

  /**
   * @return {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const { disabled, selected, values } = this.props;
    const displayLabel = this.props.label;
    const translatedLabel = __('product.pick_an_attribute', [displayLabel]);
    const buttonLabel = this.getButtonLabel(translatedLabel);
    const classes = classNames(
      styles.button,
      { [styles.buttonDisabled]: disabled }
    );

    return (
      <Fragment>
        <button className={classes} onClick={this.handleButtonClick} ref={this.props.charRef}>
          {selected && <div className={styles.label}>{translatedLabel}</div>}
          <div className={styles.selection}>{buttonLabel}</div>
        </button>
        <Sheet
          label={translatedLabel}
          open={this.state.sheet}
          items={values}
          onClose={this.closeSheet}
          onSelect={this.handleItemSelection}
          selectedValue={selected}
        />
      </Fragment>
    );
  }
}

export default Characteristic;
