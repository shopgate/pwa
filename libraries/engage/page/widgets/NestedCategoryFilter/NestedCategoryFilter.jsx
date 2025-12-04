import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { I18n, ButtonLink } from '@shopgate/engage/components';
import { bin2hex } from '@shopgate/engage/core/helpers';
import { CATEGORY_PATH } from '@shopgate/engage/category';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';
import { useRoute, usePrevious, useLocalStorage } from '@shopgate/engage/core/hooks';
import { router } from '@virtuous/conductor';
import CategoryPicker from './components/Picker';
import { useNestedCategoryFilterWidget } from './hooks';
import WidgetHeadline from '../../components/WidgetHeadline';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    background: colors.light,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: variables.gap.big,
  },
  buttonContainer: {
    padding: `0 ${variables.gap.big}px`,
  },
  button: {
    width: '100%',
  },
});

/**
 * The NestedCategoryFilter component
 * @returns {JSX.Element}
 */
const NestedCategoryFilter = () => {
  const { classes } = useStyles();
  const { state: routeState, id: routeId } = useRoute();

  const {
    maxDepth = 3,
    category,
    code,
    showHeadline,
    headline,
    rememberSelection,
    ...labels
  } = useNestedCategoryFilterWidget();

  const prevCategory = usePrevious(category);

  const LOCAL_STORAGE_KEY = `nestedCategoryFilterState-${code}`;
  const [storedPickers, setStoredPickers] = useLocalStorage(LOCAL_STORAGE_KEY);

  const initialPickers = useMemo(() => {
    if (rememberSelection && storedPickers) {
      return storedPickers;
    }
    if (routeState[code]?.pickers) {
      return routeState[code].pickers;
    }
    return [{
      categoryId: category,
      selectedId: null,
    }];
  }, [category, code, rememberSelection, routeState, storedPickers]);

  const [pickers, setPickers] = useState(initialPickers);
  const [buttonCategoryId, setButtonCategoryId] = useState(routeState[code]?.buttonCategoryId
    || null);

  useEffect(() => {
    if (rememberSelection) {
      setStoredPickers(pickers);
    }
  }, [pickers, rememberSelection, setStoredPickers]);

  useEffect(() => {
    if (prevCategory && prevCategory !== category) {
      setPickers([{
        categoryId: category,
        selectedId: null,
      }]);
    }
  }, [prevCategory, category]);

  useEffect(() => () => {
    router.update(routeId, {
      [code]: { pickers, buttonCategoryId },
    });
  }, [routeId, pickers, buttonCategoryId, code]);

  /**
   * Handles the selection of a subcategory within a category picker.
   * @param {string} categoryId The categoryId of the picker where a subcategory was selected.
   * @param {Object} subcategory The subcategory entity which was selected.
   */
  const handleSelection = useCallback((categoryId, subcategory) => {
    const { id: subcategoryId, childrenCount } = subcategory;
    const selectedIndex = pickers.findIndex(picker => picker.categoryId === categoryId);

    // Get all pickers up to the selected picker and update its selectedId
    let updatedPickers = pickers.slice(0, selectedIndex + 1);
    updatedPickers[updatedPickers.length - 1].selectedId = subcategoryId;
    // Check if a new picker should be added
    const limitReached = updatedPickers?.length === Number(maxDepth);
    const appendNewPicker = !!childrenCount && !limitReached;

    if (appendNewPicker) {
      updatedPickers = updatedPickers.concat([{
        categoryId: subcategoryId,
        selectedId: null,
      }]);
    }

    setPickers(updatedPickers);
    setButtonCategoryId(!appendNewPicker ? subcategoryId : null);
  }, [maxDepth, pickers]);

  const categoryPickers = useMemo(() => (
    <>
      {pickers.slice(0, maxDepth).map((entry, index) => {
        const { categoryId, selectedId } = entry;
        return (
          <CategoryPicker
            key={`${categoryId}-${code}`}
            categoryId={categoryId}
            selectedId={selectedId}
            onSelect={handleSelection}
            label={labels[`level${index + 1}Label`] || ''}
          />
        );
      })}
    </>
  ), [code, handleSelection, labels, maxDepth, pickers]);

  return (
    <div className={classes.container}>
      {(showHeadline && headline) ? (
        <WidgetHeadline headline={headline} />
      ) : null}
      { categoryPickers }
      <div className={classes.buttonContainer}>
        <ButtonLink
          className={classes.button}
          href={`${CATEGORY_PATH}/${bin2hex(buttonCategoryId)}`}
          disabled={!buttonCategoryId}
          flat={false}
        >
          <I18n.Text string="common.show_products" />
        </ButtonLink>
      </div>
    </div>
  );
};

export default NestedCategoryFilter;
