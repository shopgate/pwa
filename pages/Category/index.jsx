import React, { PureComponent } from 'react';
import Consume from '@shopgate/pwa-common/components/Consume';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { RouteContext } from '@shopgate/pwa-common/context';
import { View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CategoryContent from './components/Content';

const { colors } = themeConfig;

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
      <View background={colors.background} aria-hidden={false}>
        <Consume context={RouteContext} props={map}>
          {this.consumeRenderer}
        </Consume>
      </View>
    );
  }
}

export default Category;
