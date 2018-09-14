import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CategoryList from 'Components/CategoryList';
import View from 'Components/View';
import connect from './connector';

/**
 * The root category page.
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
        <CategoryList categories={this.props.categories} prerender={8} />
      </View>
    );
  }
}

export default connect(RootCategory);

export { RootCategory as UnwrappedRootCategory };
