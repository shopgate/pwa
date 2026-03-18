import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CryptoJs from 'crypto-js';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import {
  RadioGroupV2 as RadioGroup, RadioCard, MessageBar,
} from '@shopgate/engage/components';
import { useCheckoutContext } from '@shopgate/engage/checkout/hooks/common';
import ShippingMethod from './ShippingMethod';
import connect from './connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  root: {
    padding: `0 ${variables.gap.big}px ${variables.gap.xbig}px`,
  },
  headline: {
    fontSize: '1.25rem',
    fontWeight: 'normal',
    padding: `0 ${variables.gap.small}px 0 0`,
    margin: `0 0 ${variables.gap.small}px 0`,
    color: 'var(--color-text-high-emphasis)',
    textTransform: 'none',
  },
  container: {
    border: '1px solid #eaeaea',
    ' li:nth-child(2n)': {
      background: 'var(--color-background-accent)',
    },
  },
  containerSingle: {
    padding: variables.gap.small,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
  },
  errorMessage: {
    margin: 0,
  },
});

/**
 * Hashes a shipping method
 * @param {Object} method A shipping method
 * @returns {string}
 */
const hashShippingMethod = (method) => {
  if (!method) {
    return null;
  }

  const { code, serviceLevel: { code: serviceLevelCode, carrier: { code: carrierCode } } } = method;
  return CryptoJs.MD5(`${code} ${serviceLevelCode} ${carrierCode}`).toString();
};

/**
 * The shipping methods component.
 * @returns {JSX}
 */
const ShippingMethods = ({ orderHasDirectShipItems }) => {
  const { classes } = useStyles();
  const {
    shippingAddress, updateShippingMethod, isLoading, order,
  } = useCheckoutContext();

  const {
    selectedShippingMethod = null,
    availableShippingMethods = [],
  } = shippingAddress?.orderSegment || {};

  const [selectedHash, setSelectedHash] = useState(hashShippingMethod(selectedShippingMethod));

  /**
   * Custom replacement for the wrapper component of the RadioCard
   * @param {Object} props The component props
   * @returns {JSX}
   */
  const CardComponent = ({ children }) => (
    <li className={classes.card}>
      { children}
    </li>
  );

  CardComponent.propTypes = {
    children: PropTypes.node,
  };
  CardComponent.defaultProps = {
    children: null,
  };

  useEffect(() => {
    // Update the selected hash when the selected shipping method updates
    setSelectedHash(hashShippingMethod(selectedShippingMethod));
  }, [selectedShippingMethod]);

  /**
   * The component actually doesn't render shipping methods, but service levels. To improve
   * data handling, we transform the original data structure to the shape which is required for
   * the update request.
   */
  const shippingMethods = useMemo(() => {
    // Flat map all service levels of all shipping methods and aggregate with parent (method) data.
    const unsortedLevels = availableShippingMethods.flatMap((method) => {
      const { serviceLevels, ...methodData } = method;
      return serviceLevels.map((serviceLevel) => {
        const entry = {
          ...methodData,
          serviceLevel,
        };
        const hash = hashShippingMethod(entry);
        return {
          ...entry,
          hash,
        };
      });
    });
    // Remove duplicated shipping levels that originated from different shipping methods.
    const dedupedLevels = uniqBy(unsortedLevels, ({ serviceLevel }) => `${serviceLevel.code}#${serviceLevel.carrier?.code}`);
    // Show cheapest service level first followed by alphabetic name.
    return sortBy(dedupedLevels, ['serviceLevel.cost', 'serviceLevel.name']);
  }, [availableShippingMethods]);

  const onChange = useCallback(async (event, value) => {
    // Determine the selected shipping method by its hash
    const shippingMethod = shippingMethods.find(({ hash }) => value === hash);

    if (!shippingMethod) {
      return;
    }

    // Update the local state
    setSelectedHash(shippingMethod?.hash);

    // Perform the update request
    await updateShippingMethod({
      code: shippingMethod?.code,
      serviceLevel: {
        code: shippingMethod?.serviceLevel?.code,
        carrier: {
          code: shippingMethod?.serviceLevel?.carrier?.code,
        },
      },
    });
  }, [shippingMethods, updateShippingMethod]);

  if (order?.status !== 'new' || !orderHasDirectShipItems) {
    return null;
  }

  if (shippingMethods.length === 0) {
    return (
      <div className={classes.root}>
        <h3 className={classes.headline}>
          {i18n.text('checkout.shippingMethod.title')}
        </h3>

        <MessageBar
          messages={[{
            type: 'error',
            message: i18n.text(`checkout.shippingMethod.errors.${!shippingAddress ? 'noShippingAddress' : 'invalidShippingAddress'}`),
          }]}
          classNames={{ container: classes.errorMessage }}
          showIcons
        />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <h3 className={classes.headline}>
        {i18n.text('checkout.shippingMethod.title')}
      </h3>
      { shippingMethods.length === 1 ? (
        <div className={classNames(classes.container, classes.containerSingle)}>
          <ShippingMethod shippingMethod={shippingMethods[0]} />
        </div>
      ) : (
        <RadioGroup
          name="shipping-methods"
          value={selectedHash}
          onChange={onChange}
          component="ul"
          classes={{ root: classes.container }}
          disabled={isLoading}
        >
          { shippingMethods.map(shippingMethod => (
            <RadioCard
              renderCard={CardComponent}
              value={shippingMethod.hash}
              key={shippingMethod.hash}
            >
              <ShippingMethod shippingMethod={shippingMethod} />
            </RadioCard>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

ShippingMethods.propTypes = {
  orderHasDirectShipItems: PropTypes.bool,
};

ShippingMethods.defaultProps = {
  orderHasDirectShipItems: false,
};

export default connect(ShippingMethods);
