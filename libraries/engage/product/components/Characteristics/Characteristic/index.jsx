import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { ArrowDropIcon, Typography } from '@shopgate/engage/components';
import { withStyles, cx } from '@shopgate/engage/styles';
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
    classes: PropTypes.shape({
      button: PropTypes.string,
      buttonDisabled: PropTypes.string,
      label: PropTypes.string,
      selection: PropTypes.string,
      text: PropTypes.string,
      arrow: PropTypes.string,
    }).isRequired,
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
      disabled, selected, charRef, label, classes,
    } = this.props;
    const translatedLabel = __('product.pick_an_attribute', [label]);
    const buttonLabel = this.getButtonLabel(translatedLabel);
    const cmpClasses = cx(
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
        className={cmpClasses}
        onClick={this.handleButtonClick}
        onKeyDown={() => { }}
        ref={charRef}
        style={transition[state]}
        data-test-id={label}
      >
        <div className={`${classes.text} theme__product__characteristic__text`}>
          <Typography variant="caption" component="div" className={`${classes.label} theme__product__characteristic__label`}>{label}</Typography>
          <div
            className={`${classes.selection} theme__product__characteristic__selection`}
            {...selected && { 'data-selected': true }}
          >
            {buttonLabel}
          </div>
        </div>
        <div className={`${classes.arrow} theme__product__characteristic__arrow`} aria-hidden>
          <ArrowDropIcon />
        </div>
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

export default withStyles(Characteristic, theme => ({
  button: {
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.components.input.border}`,
    borderRadius: theme.shape.borderRadius,
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 56,
    outline: 0,
    padding: '8px 8px 8px 16px',
    margin: '0 16px 12px',
    transition: 'background 250ms ease-in, color 250ms ease-in, border-color 250ms ease-in',
    '&:focus-visible': {
      borderColor: theme.palette.primary.main,
    },
  },
  buttonDisabled: {
    color: `${theme.palette.grey.medium} !important`,
    borderColor: theme.components.border.light,
    cursor: 'default',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
  },
  label: {
    marginBottom: 2,
    color: 'inherit',
    opacity: 0.7,
  },
  selection: {
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.25,
  },
  arrow: {
    display: 'flex',
    flexShrink: 0,
    fontSize: theme.components.icon.small,
  },
}));
