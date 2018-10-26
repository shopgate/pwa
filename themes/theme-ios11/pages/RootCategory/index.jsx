import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CategoryList from 'Components/CategoryList';
import View from '@shopgate/pwa-common/components/View';
import { BackBar } from 'Components/AppBar/presets';
import connect from './connector';

/**
 * The RootCategory component.
 */
class RootCategory extends PureComponent {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    categories: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        <BackBar title="titles.categories" />
        <CategoryList categories={this.props.categories} prerender={8} />
      </View>
    );
  }
}

export default connect(RootCategory);

export { RootCategory as UnwrappedRootCategory };
