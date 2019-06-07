import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@shopgate/pwa-common/context';
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
      <View aria-hidden={false}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Category;
