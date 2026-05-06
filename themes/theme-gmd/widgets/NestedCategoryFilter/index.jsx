import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { router } from '@virtuous/conductor';
import { RouteContext } from '@shopgate/pwa-common/context';
import { I18n } from '@shopgate/engage/components';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';
import Headline from 'Components/Headline';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CategoryPicker from './components/Picker';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  container: {
    background: colors.light,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    padding: theme.spacing(0, 2),
  },
  button: {
    width: '100%',
  },
}));

/**
 * @param {Object} settings Widget settings.
 * @param {Object|null|undefined} persisted State restored from the route.
 * @returns {Object} Initial widget state with `pickers` and `buttonCategoryId`.
 */
const buildInitialState = (settings, persisted) => {
  const pickers = persisted?.pickers;
  if (Array.isArray(pickers) && pickers.length > 0) {
    return {
      pickers: pickers.map(({ categoryId, selectedId }) => ({
        categoryId,
        selectedId: selectedId ?? null,
      })),
      buttonCategoryId: persisted.buttonCategoryId ?? null,
    };
  }
  return {
    pickers: [{
      categoryId: settings.categoryNumber,
      selectedId: null,
    }],
    buttonCategoryId: null,
  };
};

/**
 * Nested category filter component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const NestedCategoryFilter = ({ id, settings, persistedState }) => {
  const { classes } = useStyles();
  const route = useContext(RouteContext);
  const [state, setState] = useState(() => buildInitialState(settings, persistedState));
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const routeId = route?.id;
    if (!routeId) {
      return undefined;
    }
    return () => {
      router.update(routeId, {
        [id]: stateRef.current,
      });
    };
  }, [id, route?.id]);

  const handleSelection = useCallback((categoryId, subcategory) => {
    const { pickers } = stateRef.current;
    const { id: subcategoryId, childrenCount } = subcategory;

    const limitReached = pickers.length === Number(settings.limit);
    const appendNewPicker = !!childrenCount && !limitReached;

    const selectedIndex = pickers.findIndex(picker => picker.categoryId === categoryId);

    let updatedPickers = pickers.slice(0, selectedIndex + 1);
    updatedPickers[updatedPickers.length - 1].selectedId = subcategoryId;

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
  }, [settings.limit]);

  const { buttonCategoryId, pickers } = state;

  return (
    <div className={classes.container}>
      <Headline text={settings.headline} />
      <div>
        {pickers.map((entry, index) => {
          const { categoryId, selectedId } = entry;

          return (
            <CategoryPicker
              key={categoryId}
              categoryId={categoryId}
              selectedId={selectedId}
              onSelect={handleSelection}
              label={settings[`label_${index + 1}`]}
            />
          );
        })}
      </div>
      <div className={classes.buttonContainer}>
        <ButtonLink className={classes.button} href={`${CATEGORY_PATH}/${bin2hex(buttonCategoryId)}`} disabled={!buttonCategoryId} flat={false}>
          <I18n.Text string="common.show_products" />
        </ButtonLink>
      </div>
    </div>
  );
};

NestedCategoryFilter.propTypes = {
  id: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    categoryNumber: PropTypes.string.isRequired,
    limit: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    label_1: PropTypes.string.isRequired,
    label_2: PropTypes.string.isRequired,
    label_3: PropTypes.string.isRequired,
    label_4: PropTypes.string.isRequired,
  }).isRequired,
  persistedState: PropTypes.shape(),
};

NestedCategoryFilter.defaultProps = {
  persistedState: null,
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

export { NestedCategoryFilter as UnwrappedNestedCategoryFilter };
