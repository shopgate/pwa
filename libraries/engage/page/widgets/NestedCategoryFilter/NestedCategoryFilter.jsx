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
  const { classes, cx } = useStyles();
  const { state: routeState, id: routeId } = useRoute();

  const {
    maxDepth = 3,
    category = '',
    code,
    showHeadline,
    headline,
    rememberSelection,
    ...labels
  } = useNestedCategoryFilterWidget();

  const prevCategory = usePrevious(category);

  const LOCAL_STORAGE_KEY = `nestedCategoryFilterState-${code}`;
  const [localStorageState, setLocalStorageState] = useLocalStorage(LOCAL_STORAGE_KEY);

  const defaultState = useMemo(() => ({
    buttonCategoryId: null,
    pickers: [{
      categoryId: category,
      selectedId: null,
    }],
  }), [category]);

  const initialState = useMemo(() => {
    if (
      rememberSelection &&
      Array.isArray(localStorageState?.pickers) &&
      localStorageState.pickers.length > 0
    ) {
      const [firstPicker] = localStorageState.pickers;
      // Only rehydrate state from local storage if the pickers belong to the current category
      if (firstPicker.categoryId === category) {
        return localStorageState;
      }
    }

    if (routeState[code]) {
      return routeState[code];
    }

    return defaultState;
  }, [category, code, defaultState, localStorageState, rememberSelection, routeState]);

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const stateToPersist = {
      pickers: state.pickers,
      buttonCategoryId: state.buttonCategoryId,
    };

    if (rememberSelection) {
      // Store state in local storage when selection should should survive app restarts
      setLocalStorageState(stateToPersist);
    } else {
      // Store state in route otherwise
      router.update(routeId, {
        [code]: stateToPersist,
      });
    }
  }, [code, rememberSelection, routeId, setLocalStorageState, state]);

  useEffect(() => {
    if (typeof prevCategory === 'undefined') return;
    if (typeof category === 'undefined') return;

    if (prevCategory !== category) {
      setState(defaultState);
    }
  }, [prevCategory, category, defaultState, rememberSelection, initialState]);

  /**
   * Handles the selection of a subcategory within a category picker.
   * @param {string} categoryId The categoryId of the picker where a subcategory was selected.
   * @param {Object} subcategory The subcategory entity which was selected.
   */
  const handleSelection = useCallback((categoryId, subcategory) => {
    const { id: subcategoryId, childrenCount } = subcategory;
    const selectedIndex = state.pickers.findIndex(picker => picker.categoryId === categoryId);

    // Get all pickers up to the selected picker and update its selectedId
    let updatedPickers = state.pickers.slice(0, selectedIndex + 1);
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

    setState({
      pickers: updatedPickers,
      buttonCategoryId: !appendNewPicker ? subcategoryId : null,
    });
  }, [maxDepth, state]);

  const categoryPickers = useMemo(() => (
    <>
      {state.pickers.slice(0, maxDepth).map((entry, index) => {
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
  ), [code, handleSelection, labels, maxDepth, state.pickers]);

  return (
    <div className={classes.container}>
      {(showHeadline && headline) ? (
        <WidgetHeadline headline={headline} className="widget__nested-category-filter__headline" />
      ) : null}
      { categoryPickers }
      <div className={cx(classes.buttonContainer, 'widget__nested-category-filter__button-container')}>
        <ButtonLink
          className={cx(classes.button, 'widget__nested-category-filter__CTA-button')}
          href={`${CATEGORY_PATH}/${bin2hex(state.buttonCategoryId)}`}
          disabled={!state.buttonCategoryId}
          flat={false}
        >
          <I18n.Text string="common.show_products" className="widget__nested-category-filter__CTA-button__text" />
        </ButtonLink>
      </div>
    </div>
  );
};

export default NestedCategoryFilter;
