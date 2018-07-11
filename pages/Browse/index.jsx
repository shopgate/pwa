import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import View from 'Components/View';
import CategoryList from 'Components/CategoryList';
import Headline from 'Components/Headline';
import connect from './connector';
import SearchField from './components/SearchField';
import {
  BROWSE_CATEGORY_LIST_BEFORE,
  BROWSE_CATEGORY_LIST,
  BROWSE_CATEGORY_LIST_AFTER,
} from './constants';

/**
 * Renders the browser page.
 * @returns {JSX}
 */
class Browse extends Component {
  static propTypes = {
    getCategory: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    categories: [],
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Requests the root categories.
   */
  componentDidMount() {
    this.props.getCategory(null);
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <View noScrollOnKeyboard>
        <Headline text="titles.browse" />
        <SearchField />
        <div data-test-id="categoriesList">
          <Headline text="titles.categories" small />
          <Portal name={BROWSE_CATEGORY_LIST_BEFORE} props={{categories: this.props.categories || []}}/>
          <Portal name={BROWSE_CATEGORY_LIST} props={{categories: this.props.categories || []}} >
            <CategoryList categories={this.props.categories || []} />
          </Portal>
          <Portal name={BROWSE_CATEGORY_LIST_AFTER} props={{categories: this.props.categories || []}}/>
        </div>
      </View>
    );
  }
}

export default connect(Browse);
