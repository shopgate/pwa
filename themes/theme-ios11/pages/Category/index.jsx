import React, { PureComponent } from 'react';
import { Consume } from '@shopgate/engage/components';
import { hex2bin } from '@shopgate/engage/core';
import { RouteContext } from '@shopgate/engage/core';
import View from 'Components/View';
import CategoryContent from './components/Content';

const map = {
  id: 'params.categoryId',
  open: 'open',
};

/**
 * The category page component.
 */
class Category extends PureComponent {
  /**
   * @param {Object} props the consumed props.
   * @returns {JSX}
   */
  consumeRenderer = ({ id, open }) => {
    if (!open) {
      return null;
    }

    return <CategoryContent categoryId={hex2bin(id) || null} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Category;
