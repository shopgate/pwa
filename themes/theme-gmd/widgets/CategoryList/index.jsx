import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { ResponsiveContainer } from '@shopgate/engage/components';
import CategoryGrid from 'Components/CategoryGrid';
import connect from './connector';
import CategoryListDefault from './CategoryListDefault';
import styles from './style';

/**
 * Core category list widget.
 * @param {Object} props The widget properties
 * @returns {JSX}
 */
class CategoryListWidget extends Component {
  static propTypes = {
    settings: PropTypes.shape().isRequired,
    getCategory: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    getCategory: () => {},
    items: null,
  };

  /**
   * Get the category data once the component has mounted.
   */
  componentDidMount() {
    if (!this.props.items) {
      this.props.getCategory(this.props.settings.categoryNumber);
    }
  }

  /**
   * Only update when we have category items.
   * @param {Object} nextProps The next set of component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.items &&
      (!isEqual(this.props.items, nextProps.items) ||
        !isEqual(this.props.settings, nextProps.settings))
    );
  }

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    const { items, settings } = this.props;

    if (!items) {
      return null;
    }

    return (
      <div className={styles.container} data-test-id="categoryList">
        {(settings.headline) ? <h3 className={styles.headline}>{settings.headline}</h3> : null}
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <CategoryListDefault categories={items} settings={settings} />
        </ResponsiveContainer>
        <ResponsiveContainer webOnly breakpoint=">xs">
          <CategoryGrid categories={items} showImages={settings.showImages} />
        </ResponsiveContainer>
      </div>
    );
  }
}

export default connect(CategoryListWidget);

export { CategoryListWidget as Unwrapped };
