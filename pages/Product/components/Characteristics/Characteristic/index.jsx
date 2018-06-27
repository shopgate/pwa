import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';
import Sheet from './components/Sheet';
import { ProductContext } from '../../../context';

/**
 * A single characteristic.
 */
class Characteristic extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    setCharacteristic: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selected: PropTypes.string,
  };

  static defaultProps = {
    selected: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @param {Object} props  The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      sheet: false,
    };
  }

  /**
   * @return {string}
   */
  get label() {
    return this.props.label;
  }

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
    this.props.setCharacteristic({
      id: this.props.id,
      value: valueId,
    });

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
    const displayLabel = this.label;
    const translatedLabel = __('product.pick_an_attribute', [displayLabel]);
    const buttonLabel = this.getButtonLabel(translatedLabel);
    const classes = classNames(
      styles.button,
      { [styles.buttonDisabled]: disabled }
    );

    return (
      <Fragment>
        <button className={classes} onClick={this.handleButtonClick}>
          {selected && <div className={styles.label}>{translatedLabel}</div>}
          <div className={styles.selection}>{buttonLabel}</div>
        </button>
        <Sheet
          label={translatedLabel}
          open={this.state.sheet}
          items={values}
          onSelect={this.handleItemSelection}
        />
      </Fragment>
    );
  }
}

export default props => (
  <ProductContext.Consumer>
    {({ setCharacteristic }) => (
      <Characteristic {...props} setCharacteristic={setCharacteristic} />
    )}
  </ProductContext.Consumer>
);
