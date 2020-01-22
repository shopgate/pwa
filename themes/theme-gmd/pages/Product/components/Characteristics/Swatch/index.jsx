import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import { VariantSwatch } from '@shopgate/engage/product';
import styles from './style';
import transition from '../transition';

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
    // eslint-disable-next-line react/no-unused-prop-types
    highlight: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    selected: PropTypes.string,
  };

  static defaultProps = {
    selected: null,
  };

  state = { highlight: false };

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
  }

  /**
   * @param {string} valueId The ID of the selected value.
   */
  handleItemSelection = (valueId) => {
    this.props.select({
      id: this.props.id,
      value: valueId,
    });
  }

  removeHighlight = () => {
    this.setState({ highlight: false });
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      id, disabled, charRef, label, values,
    } = this.props;

    const swatch = {
      id,
      label,
      values,
    };

    return (
      <Fragment>
        <Transition in={this.state.highlight} timeout={500} onEntered={this.removeHighlight}>
          {state => (
            <div
              aria-hidden
              className={classNames(styles.label, { [styles.labelDisabled]: disabled })}
              ref={charRef}
              style={transition[state]}
              data-test-id={label}
            >
              {this.getLabel(label)}
            </div>
          )}
        </Transition>
        <div className={styles.items}>
          <VariantSwatch swatch={swatch} onClick={this.handleItemSelection} />
        </div>
      </Fragment>
    );
  }
}

export default Swatch;
