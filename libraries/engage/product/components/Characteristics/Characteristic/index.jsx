import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import { ResponsiveContainer, ArrowDropIcon } from '@shopgate/engage/components';
import { withStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import Sheet from './components/Sheet';
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
    highlight: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    classes: PropTypes.shape({
      arrow: PropTypes.string,
      button: PropTypes.string,
      buttonDisabled: PropTypes.string,
      label: PropTypes.string,
      selection: PropTypes.string,
    }),
    selected: PropTypes.string,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    classes: {
      arrow: '',
      button: '',
      buttonDisabled: '',
      label: '',
      selection: '',
    },
    selected: null,
  };

  /**
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);
    this.state = {
      highlight: false,
      sheet: false,
    };
  }

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
  };

  /**
   * @param {Object} event The event object.
   */
  handleButtonClick = (event) => {
    event.preventDefault();

    if (this.props.disabled) {
      return;
    }

    this.setState({ sheet: true });
  };

  /**
   * @param {string} valueId The ID of the selected value.
   */
  handleItemSelection = (valueId) => {
    this.props.select({
      id: this.props.id,
      value: valueId,
    });

    this.closeSheet();
  };

  closeSheet = () => {
    this.setState({ sheet: false });
  };

  sheetDidClose = () => {
    if (this.props.charRef && this.props.charRef.current) {
      // Focus the element that triggered the CharacteristicsSheet after it closes
      this.props.charRef.current.focus();
    }
  };

  removeHighlight = () => {
    this.setState({ highlight: false });
  };

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
    const classes = withStyles.getClasses(this.props);
    const translatedLabel = __('product.pick_an_attribute', [label]);
    const buttonLabel = this.getButtonLabel(translatedLabel);
    const buttonClasses = classNames(
      classes.button,
      { [classes.buttonDisabled]: disabled },
      'theme__product__characteristic'
    );

    return (
      <div
        role="button"
        aria-disabled={disabled}
        aria-haspopup={!disabled}
        tabIndex={0}
        className={buttonClasses}
        onClick={this.handleButtonClick}
        onKeyDown={() => { }}
        ref={charRef}
        style={transition[state]}
        data-test-id={label}
      >
        {selected && <div className={`${classes.label} theme__product__characteristic__label`}>{label}</div>}
        <div
          className={`${classes.selection} theme__product__characteristic__selection`}
          {...selected && { 'data-selected': true }}
        >
          {buttonLabel}
        </div>
        <ResponsiveContainer breakpoint=">xs" webOnly>
          <div className={classes.arrow}>
            <ArrowDropIcon />
          </div>
        </ResponsiveContainer>
      </div>
    );
  };

  /**
   * @return {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const {
      id, selected, values, charRef,
    } = this.props;
    const displayLabel = this.props.label;
    const translatedLabel = __('product.pick_an_attribute', [displayLabel]);

    return (
      <>
        <Transition in={this.state.highlight} timeout={500} onEntered={this.removeHighlight}>
          {this.transitionRenderer}
        </Transition>
        <Sheet
          charId={id}
          contextRef={charRef}
          items={values}
          label={translatedLabel}
          onClose={this.closeSheet}
          onDidClose={this.sheetDidClose}
          onSelect={this.handleItemSelection}
          open={this.state.sheet}
          selectedValue={selected}
        />
      </>
    );
  }
}

export default withStyles(
  Characteristic,
  () => ({
    button: {
      background: 'var(--color-background-accent)',
      color: 'var(--color-text-high-emphasis)',
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 56,
      outline: 0,
      padding: '12px 16px',
      marginBottom: 8,
      transition: 'background 250ms ease-in, color 250ms ease-in',
    },
    buttonDisabled: {
      color: `${themeColors.shade4} !important`,
    },
    label: {
      fontSize: 12,
      marginTop: -2,
      marginBottom: 4,
    },
    selection: {
      fontWeight: 500,
      lineHeight: 1.125,
    },
    arrow: {
      position: 'absolute',
      right: 32,
      fontSize: 20,
    },
  })
);
