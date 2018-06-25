import React, { Component } from 'react';
import ProductCharacteristics from './ProductCharacteristics';
import Characteristic from './Characteristic';

/**
 * 
 */
class Characteristics extends Component {
  render() {
    return (
      <ProductCharacteristics
        productId={this.props.productId}
        render={props => (
          <Characteristic {...props} />
        )}
        selectedCharacteristics={this.props.selectedCharacteristics}
      />
    );
  }
}

export default Characteristics;
