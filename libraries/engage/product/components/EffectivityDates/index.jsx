import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { isBeta, useWidgetSettings } from '@shopgate/engage/core';
import { I18n, TimeBoundary } from '@shopgate/engage/components';
import { showStartDateHint, showEndDateHint } from './helpers';
import { hint } from './style';
import connect from './connector';

/**
 * The Product Effectivity Dates component.
 * @return {JSX}
 */
const EffectivityDates = ({ dates, children, productNotAvailable }) => {
  if (!isBeta() || !dates) {
    return children;
  }

  const settings = useWidgetSettings('@shopgate/engage/product/EffectivityDates');

  const startDate = new Date(dates.startDate);
  const endDate = new Date(dates.endDate);

  return (
    <TimeBoundary
      start={startDate}
      end={endDate}
    >
      {({ before, between, after }) => {
        // Before
        if (before) {
          return showStartDateHint(settings, startDate)
            ? <I18n.Text
              string="product.available.at"
              params={{
                startDate,
              }}
              className={hint}
            />
            : children;
        }

        // Between
        if (between) {
          return (
            <Fragment>
              {children}
              {showEndDateHint(settings, endDate) &&
                <I18n.Text
                  string="product.available.until"
                  params={{
                  endDate,
                }}
                  className={hint}
                />
              }
            </Fragment>
          );
        }

        if (after) {
          if (!settings.accessExpired) {
            productNotAvailable();
          }

          return showEndDateHint(settings, endDate)
            ? <I18n.Text string="product.available.not" className={hint} />
            : children;
        }
        return children;
      }}
    </TimeBoundary>
  );
};

EffectivityDates.propTypes = {
  productNotAvailable: PropTypes.func.isRequired,
  children: PropTypes.element,
  dates: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }),
};

EffectivityDates.defaultProps = {
  children: null,
  dates: null,
};

export default connect(EffectivityDates);
