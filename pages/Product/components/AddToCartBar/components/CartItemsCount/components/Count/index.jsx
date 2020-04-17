import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import I18n from '@shopgate/pwa-common/components/I18n';
import { PRODUCT_UNIT_EACH } from '@shopgate/engage/product/constants';
import styles, { duration, transition } from './style';

/**
 * The Count component.
 */
class Count extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    unit: PropTypes.string,
  };

  static defaultProps = {
    unit: null,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      in: true,
      numItems: props.count,
    };
  }

  /**
   * Sets the animation state if props change.
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.count !== nextProps.count) {
      this.setState({
        in: false,
        numItems: nextProps.count,
      });
    }
  }

  /**
   * Only update if the cart product count changed.
   * @param {Object} nextProps The next props.
   * @param {Object} nextState The next state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.in !== nextState.in ||
      this.state.numItems !== nextState.numItems
    );
  }

  handleOnExited = () => {
    this.setState({ in: true });
  }

  /**
   * Render the component.
   * @return {JSX}
   */
  render() {
    const { unit } = this.props;

    return (
      <Transition
        in={this.state.in}
        onExited={this.handleOnExited}
        timeout={this.state.in ? duration : 0}
      >
        {state => (
          <div className={styles.container} style={transition[state]}>
            {unit && unit !== PRODUCT_UNIT_EACH ? (
              <I18n.Text
                string="product.item_added_unit"
                params={{
                  unit,
                  count: this.state.numItems,
                }}
              />
            ) : (
              <I18n.Text string="product.item_added" params={{ count: this.state.numItems }} />
            )}
          </div>
        )}
      </Transition>
    );
  }
}

export default Count;
