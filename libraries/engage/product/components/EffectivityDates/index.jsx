import React from 'react';
import PropTypes from 'prop-types';
import {
  isBeta,
  useWidgetSettings,
  useWidgetStyles,
} from '@shopgate/engage/core';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import {
  TimeBoundary, SurroundPortals, Typography,
} from '@shopgate/engage/components';
import { PRODUCT_EFFECTIVITY_DATES } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { showExpiringLabel, showScheduledLabel } from './helpers';
import connect from './connector';

const useStyles = makeStyles()((theme, { hintStyle }) => ({
  hint: {
    color: theme.palette.success.main,
    ...(hintStyle || {}),
  },
  notAvailable: {
    color: theme.palette.error.main,
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
  const { classes, cx } = useStyles({ hintStyle: styles?.hint });

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
              ? (
                <Typography variant="caption" component="span" color="success" className={classes.hint}>
                  {i18n.text('product.available.at', { startDate })}
                </Typography>
              )
              : children;
          }

          if (between) {
            return (
              <>
                {children}
                {showExpiringLabel(endDate, settings) &&
                  (
                    <Typography variant="caption" component="span" color="success" className={classes.hint}>
                      {i18n.text('product.available.until', { endDate })}
                    </Typography>
                  )}
              </>
            );
          }

          if (after) {
            productNotAvailable();

            return showExpiringLabel(endDate, settings)
              ? (
                <Typography
                  variant="caption"
                  component="span"
                  color="error"
                  className={cx(classes.hint, classes.notAvailable)}
                >
                  {i18n.text('product.available.not')}
                </Typography>
              )
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
