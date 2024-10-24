import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals, ResponsiveContainer } from '@shopgate/engage/components';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import {
  PORTAL_FILTER_PRICE_RANGE,
  PORTAL_FILTER_PAGE_CONTENT,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
  PriceSlider,
} from '@shopgate/engage/filter';
import Selector from './components/Selector';
import ApplyButton from './components/ApplyButton';
import ResetButton from './components/ResetButton';

/**
 * The FilterPageContent component renders all filters for the filter page.
 * @param {Object} props The component props.
 * @param {React.ComponentType} props.AppBarComponent The component to be rendered as the app bar
 * @returns {JSX.Element}
 */
const FilterPageContent = ({ AppBarComponent }) => {
  const {
    apiFilters,
    resetPossible,
    hasChanged,
    applyFilters,
    resetAllFilters,
    getSelectedFilterValues,
    updateSelectedFilterValues,
  } = useFilterPage();

  return (
    <SurroundPortals portalName={PORTAL_FILTER_PAGE_CONTENT}>
      { AppBarComponent && (
        <AppBarComponent
          title="titles.filter"
          right={<ApplyButton disabled={!hasChanged} onClick={applyFilters} />}
        />
      )}
      {apiFilters.map((filter) => {
        const portalProps = { filter };
        const value = getSelectedFilterValues(filter.id);

        if (filter.type === FILTER_TYPE_RANGE) {
          return (
            <Fragment key={filter.id}>
              <SurroundPortals portalName={PORTAL_FILTER_PRICE_RANGE} portalProps={portalProps}>
                <PriceSlider
                  id={filter.id}
                  key={filter.id}
                  min={filter.minimum}
                  max={filter.maximum}
                  onChange={updateSelectedFilterValues}
                  value={value}
                />
              </SurroundPortals>
            </Fragment>
          );
        }

        return (
          <Selector
            id={filter.id}
            key={filter.id}
            label={filter.label}
            values={filter.values}
            multi={filter.type === FILTER_TYPE_MULTISELECT}
            onChange={updateSelectedFilterValues}
            selected={value}
          />
        );
      })}
      <ResponsiveContainer breakpoint="<sm" appAlways>
        <ResetButton disabled={!resetPossible} onClick={resetAllFilters} />
      </ResponsiveContainer>
    </SurroundPortals>
  );
};

FilterPageContent.propTypes = {
  AppBarComponent: PropTypes.elementType,
};

FilterPageContent.defaultProps = {
  AppBarComponent: null,
};

export default FilterPageContent;
