import React, { useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { router } from '@virtuous/conductor';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { Chip, ChipLayout } from '@shopgate/engage/components';
import { FILTER_TYPE_RANGE, FILTER_TYPE_MULTISELECT, translateFilterLabel } from '@shopgate/engage/filter';
import { i18n } from '@shopgate/engage/core';
import connect from './connector';
import styles from './style';

/**
 * The FilterChips component.
 * @returns {JSX}
 */
const FilterChips = ({
  filters,
  routeId,
  updateFilters,
  scrollTop,
  openFilters,
  currentPathname,
  onChipCountUpdate,
}) => {
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

        router.update(routeId, { filters: newFilters });
        updateFilters(newFilters);
        scrollTop();
        return;
      }
    }

    const newFilters = (Object.keys(rest).length) ? rest : null;
    router.update(routeId, { filters: newFilters });
    updateFilters(newFilters);
    scrollTop();
  }, [filters, routeId, scrollTop, updateFilters]);

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
            <Chip
              id={key}
              key={`filter-${key}`}
              onRemove={handleRemove}
              onClick={openFilters}
              removeLabel={removeLabel}
              editLabel={editLabel}
            >
              {pricesFormatted}
            </Chip>
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
              <Chip
                id={value.id}
                key={`filter-${value.id}`}
                onRemove={() => handleRemove(filter.id, value.id)}
                onClick={openFilters}
                removeLabel={removeLabel}
                editLabel={editLabel}
              >
                {filterFormatted}
              </Chip>
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
    <div className={`${styles} theme__filter-bar__filter-chips`}>
      <ChipLayout
        moreLabel="filter.more"
        handleMoreButton={openFilters}
        pathname={currentPathname}
      >
        {chips}
      </ChipLayout>
    </div>
  );
};

FilterChips.propTypes = {
  openFilters: PropTypes.func.isRequired,
  routeId: PropTypes.string.isRequired,
  updateFilters: PropTypes.func.isRequired,
  currentPathname: PropTypes.string,
  filters: PropTypes.shape(),
  onChipCountUpdate: PropTypes.func,
  scrollTop: PropTypes.func,
};

FilterChips.defaultProps = {
  currentPathname: '',
  filters: null,
  scrollTop: noop,
  onChipCountUpdate: noop,
};

export default connect(FilterChips);
