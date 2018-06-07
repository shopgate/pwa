import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Picker from 'Components/Picker';
import PriceDifference from './components/PriceDifference';
import connect from './connector';
import styles from './style';

/**
 * The Product Options component.
 */
class Options extends Component {
  static propTypes = {
    storeSelection: PropTypes.func.isRequired,
    currentOptions: PropTypes.shape(),
    options: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    currentOptions: {},
    options: null,
  };

  /**
   * Triggers storeSelections when the component is mounted and has options set.
   */
  componentDidMount() {
    if (!this.props.storeSelection || !this.props.options) {
      return;
    }

    this.props.options.forEach((option) => {
      // Only options of type 'select' have a default value. Type 'text' has no default.
      if (option.type !== 'select') {
        return;
      }

      this.props.storeSelection(option.id, option.items[0].value);
    });
  }

  /**
   * When the component receives the product options
   * it will set the first value of each option as active
   * @param {Object} nextProps The incoming props.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.options && nextProps.options) {
      nextProps.options.forEach((option) => {
        // Only options of type 'select' have a default value. Type 'text' has no default.
        if (option.type !== 'select') {
          return;
        }

        this.props.storeSelection(option.id, option.items[0].value);
      });
    }
  }

  /**
   * Only update when options change.
   * @param {Object} nextProps The incoming props.
   * @param {Object} nextState The new state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return this.props.options !== nextProps.options ||
      this.props.currentOptions !== nextProps.currentOptions;
  }

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    const { options, currentOptions } = this.props;

    if (options === null) {
      return null;
    }

    return (
      <div data-test-id="optionsPicker">
        {options.map((option) => {
          if (option.type !== 'select') {
            return null;
          }

          const params = [
            option.label,
          ];

          return (
            <div key={option.id} data-test-id={option.label}>
              <Picker
                label={option.label}
                items={option.items.map(item => ({
                  ...item,
                  rightComponent: (
                    <PriceDifference
                      className={styles.price}
                      currency={item.currency}
                      difference={item.price}
                    />
                  ),
                }))}
                placeholder={
                  <I18n.Text string="product.pick_an_attribute" params={params} />
                }
                value={currentOptions[option.id]}
                onChange={value => this.props.storeSelection(option.id, value)}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(Options);
