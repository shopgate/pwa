import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import { VariantSwatch } from '@shopgate/engage/product/components';
import { withStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import transition from '../transition';

const { colors } = themeConfig;

/**
 * A single characteristic swatch type.
 */
class Swatch extends PureComponent {
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
      items: PropTypes.string,
      label: PropTypes.string,
      labelDisabled: PropTypes.string,
    }),
    selected: PropTypes.string,
  };

  static defaultProps = {
    classes: {
      items: '',
      label: '',
      labelDisabled: '',
    },
    selected: null,
  };

  /**
   * @param {Object} props The component props
   */
  constructor(props) {
    super(props);
    this.state = { highlight: false };
  }

  /**
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ highlight: nextProps.highlight });
  }

  /**
   * @param {string} charLabel The default button label.
   * @return {string}
   */
  getLabel = (charLabel) => {
    if (!this.props.selected) {
      return charLabel;
    }

    const value = this.props.values.find(val => (val.id === this.props.selected));
    return `${charLabel} - ${value.label}`;
  };

  /**
   * @param {string} valueId The ID of the selected value.
   */
  handleItemSelection = (valueId) => {
    this.props.select({
      id: this.props.id,
      value: valueId,
    });
  };

  removeHighlight = () => {
    this.setState({ highlight: false });
  };

  /**
   * @return {JSX}
   */
  render() {
    const {
      id, disabled, charRef, label, values,
    } = this.props;
    const classes = withStyles.getClasses(this.props);

    const swatch = {
      id,
      label,
      values,
    };

    return (
      <>
        <Transition in={this.state.highlight} timeout={500} onEntered={this.removeHighlight}>
          {state => (
            <div
              aria-hidden
              className={classNames(classes.label, { [classes.labelDisabled]: disabled })}
              ref={charRef}
              style={transition[state]}
              data-test-id={label}
            >
              {this.getLabel(label)}
            </div>
          )}
        </Transition>
        <div className={classes.items}>
          <VariantSwatch swatch={swatch} onClick={this.handleItemSelection} />
        </div>
      </>
    );
  }
}

export default withStyles(
  Swatch,
  () => ({
    label: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 56,
      outline: 0,
      padding: '12px 16px',
      transition: 'background 250ms ease-in, color 250ms ease-in',
      fontWeight: 500,
      lineHeight: 1.125,
    },
    labelDisabled: {
      color: colors.shade4,
    },
    items: {
      padding: '0 16px',
      marginBottom: 16,
    },
  })
);
