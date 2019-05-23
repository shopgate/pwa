import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import CategoryList from 'Components/CategoryList';
import Headline from 'Components/Headline';
import {
  BROWSE_CATEGORY_LIST_BEFORE,
  BROWSE_CATEGORY_LIST,
  BROWSE_CATEGORY_LIST_AFTER,
} from '../../constants';
import connect from './connector';
import styles from './styles';

/**
 * The BackBar component.
 */
class RootCategories extends PureComponent {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    categories: [],
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    return (
      <div data-test-id="categoriesList">
        <Headline style={styles.headline} text={__('titles.categories')} />
        <Portal
          name={BROWSE_CATEGORY_LIST_BEFORE}
          props={{ categories: this.props.categories }}
        />
        <Portal
          name={BROWSE_CATEGORY_LIST}
          props={{ categories: this.props.categories }}
        >
          <CategoryList categories={this.props.categories} />
        </Portal>
        <Portal
          name={BROWSE_CATEGORY_LIST_AFTER}
          props={{ categories: this.props.categories }}
        />
      </div>
    );
  }
}

export default connect(RootCategories);
