import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { CategoryList } from '@shopgate/engage/category/components';
import { useCategorySettings } from '@shopgate/engage/category/hooks';
import Headline from 'Components/Headline';
import {
  BROWSE_CATEGORY_LIST,
  BROWSE_CATEGORY_LIST_HEADLINE,
} from '../../constants';
import connect from './connector';
import styles from './styles';

/**
 * The root categories in the configured layout.
 * @param {Object} props The component props.
 * @param {Array} props.categories The root categories.
 * @returns {JSX.Element}
 */
const ConfiguredCategoryList = ({ categories }) => {
  const { layout, showImages } = useCategorySettings();

  return (
    <CategoryList
      categories={categories}
      layout={layout}
      showLeftSideImages={layout === 'list' && showImages}
    />
  );
};

ConfiguredCategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

ConfiguredCategoryList.defaultProps = {
  categories: [],
};

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
        <SurroundPortals
          portalName={BROWSE_CATEGORY_LIST_HEADLINE}
        >
          <Headline style={styles.headline} text={__('titles.allCategories')} />
        </SurroundPortals>
        <SurroundPortals
          portalName={BROWSE_CATEGORY_LIST}
          portalProps={{ categories: this.props.categories }}
        >
          <ConfiguredCategoryList categories={this.props.categories} />
        </SurroundPortals>
      </div>
    );
  }
}

export default connect(RootCategories);
