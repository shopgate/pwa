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

const PLACEHOLDER_COUNT = 6;

/**
 * The root categories in the configured layout.
 * @param {Object} props The component props.
 * @param {Array} props.categories The root categories.
 * @param {number} props.prerender The number of placeholder rows to show while loading.
 * @returns {JSX.Element}
 */
const ConfiguredCategoryList = ({ categories, prerender }) => {
  const { layout, showImages } = useCategorySettings();

  return (
    <CategoryList
      categories={categories}
      prerender={prerender}
      layout={layout}
      showLeftSideImages={layout === 'list' && showImages}
    />
  );
};

ConfiguredCategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape()),
  prerender: PropTypes.number,
};

ConfiguredCategoryList.defaultProps = {
  categories: [],
  prerender: 0,
};

/**
 * The BackBar component.
 */
class RootCategories extends PureComponent {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape()),
    categoriesFetching: PropTypes.bool,
  };

  static defaultProps = {
    categories: [],
    categoriesFetching: false,
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
          <ConfiguredCategoryList
            categories={this.props.categories}
            prerender={this.props.categoriesFetching ? PLACEHOLDER_COUNT : 0}
          />
        </SurroundPortals>
      </div>
    );
  }
}

export default connect(RootCategories);
