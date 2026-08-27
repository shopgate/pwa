import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { useFilterPage } from '@shopgate/engage/filter/hooks';
import { makeStyles } from '@shopgate/engage/styles';
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

const useStyles = makeStyles()(theme => ({
  content: {
    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: 640,
      margin: '0 auto',
    },
  },
}));

/**
 * The FilterPageContent component renders all filters for the filter page.
 * @param {Object} props The component props.
 * @param {React.ComponentType} props.AppBarComponent The component to be rendered as the app bar
 * @returns {JSX.Element}
 */
const FilterPageContent = ({ AppBarComponent }) => {
  const { classes } = useStyles();
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
      <div className={classes.content}>
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
        <ResetButton disabled={!resetPossible} onClick={resetAllFilters} />
      </div>
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
