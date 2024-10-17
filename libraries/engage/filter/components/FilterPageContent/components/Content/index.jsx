import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import {
  FILTER_PRICE_RANGE,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_MULTISELECT,
  PriceSlider,
} from '@shopgate/engage/filter';
import Selector from '../Selector';
import ApplyButton from '../ApplyButton';
import ResetButton from '../ResetButton';

/**
 * The Content component renders all filters for the filter page.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Content = ({ AppBarComponent }) => {
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
    <Fragment>
      { AppBarComponent && (
        <AppBarComponent
          title="titles.filter"
          right={<ApplyButton active={hasChanged} onClick={applyFilters} />}
        />
      )}
      {apiFilters.map((filter) => {
        const portalProps = { filter };
        const value = getSelectedFilterValues(filter.id);

        if (filter.type === FILTER_TYPE_RANGE) {
          return (
            <Fragment key={filter.id}>
              <SurroundPortals portalName={FILTER_PRICE_RANGE} portalProps={portalProps}>
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
      <ResetButton active={resetPossible} onClick={resetAllFilters} />
    </Fragment>
  );
};

Content.propTypes = {
  AppBarComponent: PropTypes.elementType,
};

Content.defaultProps = {
  AppBarComponent: null,
};

export default Content;
