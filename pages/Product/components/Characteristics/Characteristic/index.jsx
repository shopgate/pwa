import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';
import Sheet from './components/Sheet';
import ProductContext from '../../../context';

/**
 * 
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
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);

    this.state = {
      sheet: false,
    };
  }

  /**
   * 
   */
  handleButtonClick = () => {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      sheet: true,
    });
  }

  /**
   * 
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

  findValueById = (value) => {
    return value.id === this.props.selected;
  }

  getButtonLabel = (defaultLabel) => {
    if (!this.props.selected) {
      return defaultLabel;
    }

    const value = this.props.values.find(this.findValueById);

    return value.label;
  }

  get label() {
    return this.props.label.toLowerCase();
  }

  /**
   * 
   */
  render() {
    const { disabled, selected, values } = this.props;

    const { __ } = this.context.i18n();

    const displayLabel = this.label;
    const translatedLabel = __('product.pick_an_attribute', [displayLabel]);

    const buttonLabel = this.getButtonLabel(translatedLabel);

    const classes = classNames(
      [styles.button],
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
          selectCharacteristic={this.handleItemSelection}
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
