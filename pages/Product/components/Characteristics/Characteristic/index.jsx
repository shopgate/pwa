import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import Sheet from './components/Sheet';
import styles from './style';
import transition from './transition';

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
    highlight: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selected: PropTypes.string,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    selected: null,
  };

  state = {
    highlight: false,
    sheet: false,
  };

  /**
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({ highlight: nextProps.highlight });
  }

  /**
   * @param {string} defaultLabel The default button label.
   * @return {string}
   */
  getButtonLabel = (defaultLabel) => {
    if (!this.props.selected) {
      return defaultLabel;
    }

    const value = this.props.values.find(val => (val.id === this.props.selected));

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

    this.setState({ sheet: true });
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
    this.setState({ sheet: false });
  }

  removeHighlight = () => {
    this.setState({ highlight: false });
  }

  /**
   * @return {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const {
      disabled,
      id,
      selected,
      values,
      charRef,
    } = this.props;
    const displayLabel = this.props.label;
    const translatedLabel = __('product.pick_an_attribute', [displayLabel]);
    const buttonLabel = this.getButtonLabel(translatedLabel);
    const classes = classNames(styles.button, { [styles.buttonDisabled]: disabled });

    return (
      <Fragment>
        <Transition in={this.state.highlight} timeout={500} onEntered={this.removeHighlight}>
          {state => (
            <button
              className={classes}
              onClick={this.handleButtonClick}
              ref={charRef}
              style={transition[state]}
            >
              {selected && <div className={styles.label}>{displayLabel}</div>}
              <div className={styles.selection}>{buttonLabel}</div>
            </button>
          )}
        </Transition>
        <Sheet
          charId={id}
          items={values}
          label={translatedLabel}
          onClose={this.closeSheet}
          onSelect={this.handleItemSelection}
          open={this.state.sheet}
          selectedValue={selected}
        />
      </Fragment>
    );
  }
}

export default Characteristic;
