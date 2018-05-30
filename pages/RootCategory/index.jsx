import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CategoryList from 'Components/CategoryList';
import View from 'Components/View';
import connect from './connector';

/**
 * The RootCategory component.
 */
class RootCategory extends Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape()),
  }

  static defaultProps = {
    categories: [],
  }

  /**
   * @param {Object} nextProps The next component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (!this.props.categories && nextProps.categories);
  }

  /**
   * @return {JSX}
   */
  render() {
    const { categories } = this.props;

    return (
      <View>
        <CategoryList categories={categories} />
      </View>
    );
  }
}

export default connect(RootCategory);
