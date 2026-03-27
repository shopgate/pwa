import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  isBeta,
  useWidgetSettings,
  useWidgetStyles,
} from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { I18n, TimeBoundary, SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_EFFECTIVITY_DATES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { showExpiringLabel, showScheduledLabel } from './helpers';
import connect from './connector';

const useStyles = makeStyles()((theme, { hintStyle }) => ({
  hint: {
    color: theme.palette.success.main,
    fontSize: '0.75rem',
    ...(hintStyle || {}),
  },
  notAvailable: {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
  },
}));

/**
 * The Product Effectivity Dates component.
 * @return {JSX}
 */
const EffectivityDates = ({
  dates, children, productNotAvailable, productId,
}) => {
  const settings = useWidgetSettings('@shopgate/engage/product/EffectivityDates');
  const styles = useWidgetStyles('@shopgate/engage/product/EffectivityDates');
  const { classes } = useStyles({ hintStyle: styles?.hint });

  if (!isBeta() || !dates) {
    return children;
  }

  const startDate = dates.startDate ? new Date(dates.startDate) : null;
  const endDate = dates.endDate ? new Date(dates.endDate) : null;

  return (
    <SurroundPortals
      portalName={PRODUCT_EFFECTIVITY_DATES}
      portalProps={{
        dates,
        productNotAvailable,
        productId,
      }}
    >
      <TimeBoundary start={startDate} end={endDate}>
        {({ before, between, after }) => {
          if (before) {
            return showScheduledLabel(startDate, settings)
              ? <I18n.Text string="product.available.at" params={{ startDate }} className={classes.hint} />
              : children;
          }

          if (between) {
            return (
              <>
                {children}
                {showExpiringLabel(endDate, settings) &&
                  <I18n.Text string="product.available.until" params={{ endDate }} className={classes.hint} />}
              </>
            );
          }

          if (after) {
            productNotAvailable();

            return showExpiringLabel(endDate, settings)
              ? <I18n.Text string="product.available.not" className={classNames(classes.hint, classes.notAvailable)} />
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
  productId: null,
};

export default connect(EffectivityDates);
