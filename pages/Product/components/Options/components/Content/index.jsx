import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Option from '../Option';
import TextOption from '../TextOption';
import { ProductContext } from '../../../../context';
import connect from './connector';

/**
 * The Product Options component.
 */
class Options extends PureComponent {
  static contextType = ProductContext;

  static propTypes = {
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
    if (!this.context || !this.context.setOption || !this.props.options) {
      return;
    }

    this.handleStoreSelection(this.props);
  }

  /**
   * When the component receives the product options
   * it will set the first value of each option as active
   * @param {Object} nextProps The incoming props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.options && nextProps.options) {
      this.handleStoreSelection(nextProps);
    }
  }

  /**
   * @param {Object} props The component props.
   */
  handleStoreSelection = (props) => {
    props.options.forEach((option) => {
      // Only options of type 'select' have a default value. Type 'text' has no default.
      if (option.type !== 'select') {
        return;
      }

      this.context.setOption(option.id, option.items[0].value, option.items[0].price);
    });
  }

  /**
   * Renders the component
   * @returns {JSX}
   */
  render() {
    const { options, currentOptions } = this.props;

    if (!options) {
      return null;
    }

    return (
      <ProductContext.Consumer>
        {({ setOption }) => (
          <div data-test-id="optionsPicker">
            {options.map((option) => {
              switch (option.type) {
                case 'text':
                  return (
                    <TextOption
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      value={currentOptions[option.id]}
                      info={option.info}
                      onChange={setOption}
                      required={option.required}
                      price={option.price}
                    />
                  );
                case 'select':
                  return (
                    <Option
                      key={option.id}
                      label={option.label}
                      id={option.id}
                      items={option.items}
                      value={currentOptions[option.id]}
                      onChange={setOption}
                    />
                  );
                default:
                  // unknown type
                  return null;
              }
            })}
          </div>
        )}
      </ProductContext.Consumer>
    );
  }
}

export default connect(Options);
