import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Option from './components/Option';
import connect from './connector';

/**
 * The Product Options component.
 */
class Options extends PureComponent {
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
   * Renders the component
   * @returns {JSX}
   */
  render() {
    const { options, currentOptions, storeSelection } = this.props;

    if (options === null) {
      return null;
    }

    return (
      <div data-test-id="optionsPicker">
        {options.map((option) => {
          if (option.type !== 'select') {
            return null;
          }

          return (
            <Option
              key={option.id}
              label={option.label}
              id={option.id}
              items={option.items}
              value={currentOptions[option.id]}
              onChange={storeSelection}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(Options);
