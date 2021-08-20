import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';
import {
  isBeta,
  useWidgetSettings,
  useWidgetStyles,
} from '@shopgate/engage/core';
import { I18n, TimeBoundary, SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_EFFECTIVITY_DATES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { showExpiringLabel, showScheduledLabel } from './helpers';
import { hint, notAvailable } from './style';
import connect from './connector';

/**
 * The Product Effectivity Dates component.
 * @return {JSX}
 */
const EffectivityDates = ({
                            dates, children, productNotAvailable, productId,
                          }) => {
  if (!isBeta() || !dates) {
    return children;
  }

  const settings = useWidgetSettings('@shopgate/engage/product/EffectivityDates');
  const styles = useWidgetStyles('@shopgate/engage/product/EffectivityDates');

  const startDate = dates.startDate ? new Date(dates.startDate) : null;
  const endDate = dates.endDate ? new Date(dates.endDate) : null;

  const hintAddClass = styles && styles.hint ? css(styles.hint).toString() : null;
  const hintClass = classNames(hint, hintAddClass);

  return (
    <SurroundPortals
      portalName={PRODUCT_EFFECTIVITY_DATES}
      portalProps={{ dates, productNotAvailable, productId }}
    >
      <TimeBoundary start={startDate} end={endDate}>
        {({ before, between, after }) => {
          if (before) {
            return showScheduledLabel(startDate, settings)
              ? <I18n.Text string="product.available.at" params={{ startDate }} className={hintClass} />
              : children;
          }

          if (between) {
            return (
              <Fragment>
                {children}
                {showExpiringLabel(endDate, settings) &&
                  <I18n.Text string="product.available.until" params={{ endDate }} className={hintClass} />
                }
              </Fragment>
            );
          }

          if (after) {
            productNotAvailable();

            return showExpiringLabel(endDate, settings)
              ? <I18n.Text string="product.available.not" className={hintClass} />
              : children;
          }
          return children;
        }}
      </TimeBoundary>
    </SurroundPortals>
  );
};

EffectivityDates.propTypes = {
  productNotAvailable: PropTypes.func.isRequired,
  children: PropTypes.element,
  dates: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  productId: PropTypes.string,
};

EffectivityDates.defaultProps = {
  children: null,
  dates: {
    startDate: null,
    endDate: null,
  },
};

export default connect(EffectivityDates);
