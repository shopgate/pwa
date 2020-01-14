import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import Sheet from './components/Sheet';
import styles from './style';
import transition from '../transition';

/**
 * A single characteristic.
 */
class Characteristic extends PureComponent {
  static propTypes = {
    charRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape(),
    ]).isRequired,
    disabled: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
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
  UNSAFE_componentWillReceiveProps(nextProps) {
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
    if (this.props.charRef && this.props.charRef.current) {
      this.props.charRef.current.focus();
    }
  }

  removeHighlight = () => {
    this.setState({ highlight: false });
  }

  /**
   * Renders the transition contents.
   * @param {string} state The current transition state.
   * @returns {JSX}
   */
  transitionRenderer = (state) => {
    const { __ } = this.context.i18n();
    const {
      disabled, selected, charRef, label,
    } = this.props;
    const translatedLabel = __('product.pick_an_attribute', [label]);
    const buttonLabel = this.getButtonLabel(translatedLabel);
    const classes = classNames(styles.button, { [styles.buttonDisabled]: disabled });

    return (
      <div
        role="button"
        aria-disabled={disabled}
        aria-haspopup={!disabled}
        tabIndex={0}
        className={classes}
        onClick={this.handleButtonClick}
        onKeyDown={() => { }}
        ref={charRef}
        style={transition[state]}
        data-test-id={label}
      >
        {selected && <div className={styles.label}>{label}</div>}
        <div className={styles.selection}>{buttonLabel}</div>
      </div>
    );
  }

  /**
   * @return {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const {
      id, selected, values,
    } = this.props;
    const displayLabel = this.props.label;
    const translatedLabel = __('product.pick_an_attribute', [displayLabel]);

    return (
      <Fragment>
        <Transition in={this.state.highlight} timeout={500} onEntered={this.removeHighlight}>
          {this.transitionRenderer}
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
