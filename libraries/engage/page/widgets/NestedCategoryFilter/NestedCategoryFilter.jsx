import React, {
  useCallback, useMemo, useState,
} from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';
import { I18n, ButtonLink } from '@shopgate/engage/components';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
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

  const {
    maxDepth = 3,
    category,
    code,
    level1Label,
    level2Label,
    level3Label,
    showHeadline,
    headline,
  } = useNestedCategoryFilterWidget();
  const [pickers, setPickers] = useState([{
    categoryId: category,
    selectedId: null,
  }]);
  const [buttonCategoryId, setButtonCategoryId] = useState(null);

  /**
   * Handles the selection of a subcategory within a category picker.
   * @param {string} categoryId The categoryId of the picker where a subcategory was selected.
   * @param {Object} subcategory The subcategory entity which was selected.
   */
  const handleSelection = useCallback((categoryId, subcategory) => {
    const { id: subcategoryId, childrenCount } = subcategory;
    const limitReached = pickers.length === Number(maxDepth);
    const appendNewPicker = !!childrenCount && !limitReached;
    const selectedIndex = pickers.findIndex(picker => picker.categoryId === categoryId);
    // Get all pickers from the list, till the one where the selection happened.
    let updatedPickers = pickers.slice(0, selectedIndex + 1);
    // Add the selected subcategoryId to the picker.
    updatedPickers[updatedPickers.length - 1].selectedId = subcategoryId;

    if (appendNewPicker) {
      updatedPickers = updatedPickers.concat([{
        categoryId: subcategoryId,
        selectedId: null,
      }]);
    }
    setPickers(updatedPickers);
    setButtonCategoryId(!appendNewPicker ? subcategoryId : null);
  }, [maxDepth, pickers]);

  const categoryPickers = useMemo(() => {
    const labels = [level1Label, level2Label, level3Label];
    return (
      <div>
        {pickers.map((entry, index) => {
          const { categoryId, selectedId } = entry;
          return (
            <CategoryPicker
              key={`${categoryId}-${code}`}
              categoryId={categoryId}
              selectedId={selectedId}
              onSelect={handleSelection}
              label={labels[index] || ''}
            />
          );
        })}
      </div>
    );
  }, [code, handleSelection, level1Label, level2Label, level3Label, pickers]);

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

export default props => (
  <RouteContext.Consumer>
    {({ state }) => (
      <NestedCategoryFilter
        {...props}
        // eslint-disable-next-line react/prop-types
        persistedState={state[props.id]}
      />
    )}
  </RouteContext.Consumer>
);

export { NestedCategoryFilter };
