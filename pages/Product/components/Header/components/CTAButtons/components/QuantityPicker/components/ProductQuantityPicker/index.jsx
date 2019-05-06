import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getQuantityRange } from '@shopgate/engage/product';
import Picker from 'Components/Picker';
import { ProductContext } from '../../../../../../../../context';
import connect from './connector';
import styles from './style';

/**
 * The QuantityPicker component.
 */
class ProductQuantityPicker extends PureComponent {
  static propTypes = {
    conditioner: PropTypes.shape().isRequired,
    setQuantity: PropTypes.func.isRequired,
    stock: PropTypes.shape(),
  };

  static defaultProps = {
    stock: null,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  }

  state = { opened: false };

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.props.conditioner.addConditioner('product-quantity', this.checkQuantity);
  }

  /**
   * Open sheet to select quantity,
   * wait user selection before proceed
   * @returns {Promise<any>}
   */
  checkQuantity = () => (
    new Promise((resolve) => {
      let toResolve = false;
      // Prepare set quantity
      this.setQuantity = (quantity) => {
        toResolve = true;
        this.setState({ opened: false }, () => {
          this.props.setQuantity(quantity, () => resolve(true));
        });
      };

      // Prepare close handler
      this.closePicker = () => {
        // Picker calls close cb always
        if (toResolve) {
          return;
        }
        this.setState({ opened: false }, () => resolve(false));
      };

      // Open sheet
      this.setState({
        opened: true,
      });
    })
  )

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.stock) {
      return null;
    }

    const { __ } = this.context.i18n();

    const { min, max } = getQuantityRange(this.props.stock);
    const items = Array((max - min) + 1)
      .fill(min)
      .map((v, index) => String(v + index));

    return (
      <Picker
        label={__('product.quantity')}
        items={items}
        placeholder={null}
        onSelect={this.setQuantity}
        onClose={this.closePicker}
        buttonComponent={() => null}
        hasButton={false}
        isOpen={this.state.opened}
        sheetProps={{
          contentClassName: styles.sheet,
        }}
      />
    );
  }
}

export default connect(props => (
  <ProductContext.Consumer>
    {({ conditioner, setQuantity }) => (
      <ProductQuantityPicker
        conditioner={conditioner}
        setQuantity={setQuantity}
        {...props}
      />
    )}
  </ProductContext.Consumer>
));
