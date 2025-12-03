import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} NestedCategoryFilter
 * @property {number} [maxDepth=3] The maximum depth of categories to display.
 * @property {string} category The category ID.
 * @property {string} code The widget code.
 * @property {string} level1Label The label for level 1 categories.
 * @property {string} level2Label The label for level 2 categories.
 * @property {string} level3Label The label for level 3 categories.
 * @property {boolean} showHeadline Whether to show the headline.
 * @property {Object} headline The headline data including text and styles.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<NestedCategoryFilter> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Nested Category Filter widget configuration and data.
 */
export const useNestedCategoryFilterWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config = {}, code } = useWidget();
  return {
    ...config,
    code,
  };
};
