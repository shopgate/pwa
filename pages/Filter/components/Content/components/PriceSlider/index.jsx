import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { RangeSlider } from '@shopgate/engage/components';
import Item from '../Item';
import Label from './components/Label';
import styles from './style';

/**
 * The PriceSlider component.
 */
class PriceSlider extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    max: 100,
    min: 0,
    onChange: () => { },
    value: null,
  };

  /**
   * The constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    const initialValue = props.value || [props.min, props.max];

    this.state = {
      value: initialValue,
    };
  }

  /**
   * Updates the value state.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.value, this.props.value)) {
      this.setState({ value: nextProps.value });
    }
  }

  /**
   * The callback function that is given to the RangeSlider.
   * @param {Array} value The lower and upper boundary of the set range.
   */
  onChange = (value) => {
    const roundedValue = [
      Math.floor(value[0]),
      Math.ceil(value[1]),
    ];

    this.setState({ value });
    this.props.onChange(this.props.id, roundedValue);
  };

  /**
   * Renders the component (template).
   * @returns {JSX}
   */
  render() {
    const { min, max } = this.props;

    /**
     * The min and max price need to be rounded before they are passed to the I18n component,
     * since it rounds to the full nearest number when fractions are deactivated.
     */
    const priceMin = Math.floor(this.state.value[0] / 100);
    const priceMax = Math.ceil(this.state.value[1] / 100);

    /**
     * Calculate the necessary maximum size for the price value.
     * The size is 2 characters more than the max possible number length
     * to reserve space for the currency symbol and a little spacing around.
     */
    const priceLength = `${(max / 100).toString().length + 2}ch`;

    return (
      <Item>
        <div className={styles.wrapper} data-test-id="priceRangeSlider">
          <Label priceLength={priceLength} priceMax={priceMax} priceMin={priceMin} />
          <RangeSlider
            classNames={styles.rangeSlider}
            easing="exponential"
            factor={3}
            max={max}
            min={min}
            onChange={this.onChange}
            value={this.state.value}
          />
        </div>
      </Item>
    );
  }
}

export default PriceSlider;
