import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@virtuous/react-conductor/Router';
import View from 'Components/View';
import colors from 'Styles/colors';
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
      <View background={colors.background}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Category;
