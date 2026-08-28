import React, { useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { useDispatch } from 'react-redux';
import { router } from '@virtuous/conductor';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { updateFilters } from '@shopgate/pwa-common-commerce/filter/action-creators';
import { I18n } from '@shopgate/engage/components';
import { FILTER_TYPE_RANGE, FILTER_TYPE_MULTISELECT, translateFilterLabel } from '@shopgate/engage/filter';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import FilterChip from './components/FilterChip';

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(0.5, 1.5, 1.5),
    width: '100%',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& > *': {
      flexShrink: 0,
    },
  },
  clearAll: {
    ...theme.typography.body2,
    color: theme.palette.text.primary,
    outline: 0,
    padding: theme.spacing(0.5, 1, 0.5, 0),
    whiteSpace: 'nowrap',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
  },
}));

/**
 * The FilterChips component.
 * @returns {JSX}
 */
const FilterChips = ({
  filters,
  routeId,
  scrollTop,
  openFilters,
  onChipCountUpdate,
}) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();

  const handleRemove = useCallback((id, value) => {
    const { [id]: selected, ...rest } = filters;

    if (selected.type === FILTER_TYPE_MULTISELECT) {
      // Check for one key, just remove all in that case
      if (selected.value.length > 1) {
        // Remove the index from the selected filter.
        const newSelected = {
          ...selected,
          value: selected.value.filter(entry => entry.id !== value),
        };

        const newFilters = {
          ...filters,
          [id]: newSelected,
        };

        // setTimeout prevents double click while VoiceOver is active (CCP-2485)
        setTimeout(() => {
          router.update(routeId, { filters: newFilters });
          dispatch(updateFilters(newFilters));
          scrollTop();
        }, 0);
        return;
      }
    }

    const newFilters = (Object.keys(rest).length) ? rest : null;
    router.update(routeId, { filters: newFilters });
    dispatch(updateFilters(newFilters));
    scrollTop();
  }, [dispatch, filters, routeId, scrollTop]);

  const handleClearAll = useCallback(() => {
    router.update(routeId, { filters: null });
    dispatch(updateFilters(null));
    scrollTop();
  }, [dispatch, routeId, scrollTop]);

  const chips = useMemo(() => {
    if (filters === null || !Object.keys(filters).length) {
      return [];
    }

    const entries = [];
    Object.keys(filters).forEach((key) => {
      const filter = filters[key];

      if (filter?.isHidden) {
        return;
      }

      switch (filter.type) {
        case FILTER_TYPE_RANGE: {
          /**
           * The min and max price need to be rounded before they are passed to the I18n component,
           * since it rounds to the full nearest number when fractions are deactivated.
           */
          const [minimum, maximum] = filter.value;
          const priceMin = Math.floor(minimum / 100);
          const priceMax = Math.ceil(maximum / 100);
          const fromPrice = i18n.price(priceMin, appConfig.currency, false);
          const toPrice = i18n.price(priceMax, appConfig.currency, false);
          const pricesFormatted = `${fromPrice} - ${toPrice}`;
          const labelValue = i18n.text('price.range', {
            fromPrice,
            toPrice,
          });
          const removeLabel = i18n.text('filter.remove', { filter: labelValue });
          const editLabel = i18n.text('filter.edit', { filter: labelValue });

          entries.push((
            <FilterChip
              id={key}
              key={`filter-${key}`}
              onRemove={handleRemove}
              onClick={openFilters}
              removeLabel={removeLabel}
              editLabel={editLabel}
            >
              {pricesFormatted}
            </FilterChip>
          ));

          break;
        }
        default:
          filter.value.forEach((value) => {
            if (value?.isHidden) {
              return;
            }

            const filterFormatted = `${translateFilterLabel(filter.id, filter.label)}: ${value.label}`;
            const removeLabel = i18n.text('filter.remove', { filter: filterFormatted });
            const editLabel = i18n.text('filter.edit', { filter: filterFormatted });

            entries.push((
              <FilterChip
                id={value.id}
                key={`filter-${value.id}`}
                onRemove={() => handleRemove(filter.id, value.id)}
                onClick={openFilters}
                removeLabel={removeLabel}
                editLabel={editLabel}
              >
                {filterFormatted}
              </FilterChip>
            ));
          });

          break;
      }
    });

    return entries;
  }, [filters, handleRemove, openFilters]);

  useEffect(() => {
    onChipCountUpdate(chips.length);
  }, [chips.length, onChipCountUpdate]);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={cx(classes.container, 'theme__filter-bar__filter-chips')}>
      {chips.length > 3 && (
        <button
          className={classes.clearAll}
          onClick={handleClearAll}
          data-test-id="clearAllFilters"
          type="button"
        >
          <I18n.Text string="filter.clear_all" />
        </button>
      )}
      {chips}
    </div>
  );
};

FilterChips.propTypes = {
  openFilters: PropTypes.func.isRequired,
  routeId: PropTypes.string.isRequired,
  filters: PropTypes.shape(),
  onChipCountUpdate: PropTypes.func,
  scrollTop: PropTypes.func,
};

FilterChips.defaultProps = {
  filters: null,
  scrollTop: noop,
  onChipCountUpdate: noop,
};

export default FilterChips;
