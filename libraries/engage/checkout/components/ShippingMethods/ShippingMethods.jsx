import { hot } from 'react-hot-loader/root';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import CryptoJs from 'crypto-js';
import sortBy from 'lodash/sortBy';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isIOSTheme, i18n } from '@shopgate/engage/core';
import {
  RadioGroupV2 as RadioGroup, RadioCard, MessageBar, Card, ConditionalWrapper,
} from '@shopgate/engage/components';
import { useCheckoutContext } from '@shopgate/engage/checkout/hooks/common';
import ShippingMethod from './ShippingMethod';
import connect from './connector';

const { colors, variables } = themeConfig;

const styles = {
  root: css({
    padding: `0 ${variables.gap.big}px ${variables.gap[isIOSTheme() ? 'big' : 'xbig']}px`,
  }).toString(),
  headline: css({
    color: colors.shade3,
    fontSize: '1.25rem',
    fontWeight: 'normal',
    textTransform: 'uppercase',
    padding: `0 ${variables.gap.small}px 0 0`,
    margin: `0 0 ${variables.gap.small}px 0`,
    ...(!isIOSTheme() ? {
      color: 'var(--color-text-high-emphasis)',
      textTransform: 'none',
    } : {}),
  }).toString(),
  container: css({
    ...(!isIOSTheme() ? {
      border: '1px solid #eaeaea',
    } : {}),
    ' li:nth-child(2n)': {
      background: 'var(--color-background-accent)',
    },
  }).toString(),
  containerSingle: css({
    ...(!isIOSTheme() ? {
      padding: variables.gap.small,
    } : {
      padding: variables.gap.big,
    }),
  }).toString(),
  card: css({
    display: 'flex',
    alignItems: 'center',
    ...(isIOSTheme() ? {
      padding: `${variables.gap.xsmall}px ${variables.gap.small}px 0 ${variables.gap.xsmall}px`,
    } : {}),
  }).toString(),
  errorMessage: css({
    margin: 0,
  }).toString(),
  iOSCard: css({
    width: '100%',
    overflow: 'hidden',
    marginBottom: variables.gap.big,
  }).toString(),
};

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
 * Custom replacement for the wrapper component of the RadioCard
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CardComponent = ({ children }) => (
  <li className={styles.card}>
    { children}
  </li>
);

CardComponent.propTypes = {
  children: PropTypes.node,
};
CardComponent.defaultProps = {
  children: null,
};

/**
 * The shipping methods component.
 * @returns {JSX}
 */
const ShippingMethods = ({ orderHasDirectShipItems }) => {
  const {
    shippingAddress, updateShippingMethod, isLoading, order,
  } = useCheckoutContext();

  const {
    selectedShippingMethod = null,
    availableShippingMethods = [],
  } = shippingAddress?.orderSegment || {};

  const [selectedHash, setSelectedHash] = useState(hashShippingMethod(selectedShippingMethod));

  useEffect(() => {
    // Update the selected hash when the selected shipping method updates
    setSelectedHash(hashShippingMethod(selectedShippingMethod));
  }, [selectedShippingMethod]);

  /**
   * The component actually doesn't render shipping methods, but service levels. To improve
   * data handling, we transform the original data structure to the shape which is required for
   * the update request.
   */
  const shippingMethods = useMemo(() => sortBy(availableShippingMethods.reduce((result, method) => {
    const { serviceLevels: levels, ...rest } = method;
    return result.concat(levels.map((serviceLevel) => {
      const entry = {
        ...rest,
        serviceLevel,
      };

      return {
        ...entry,
        hash: hashShippingMethod(entry),
      };
    }));
  }, []), ['serviceLevel.cost', 'serviceLevel.name']), [availableShippingMethods]);

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
      <div className={styles.root}>
        <h3 className={styles.headline}>
          {i18n.text('checkout.shippingMethod.title')}
        </h3>

        <MessageBar
          messages={[{
            type: 'error',
            message: i18n.text(`checkout.shippingMethod.errors.${!shippingAddress ? 'noShippingAddress' : 'invalidShippingAddress'}`),
          }]}
          classNames={{ container: styles.errorMessage }}
          showIcons
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h3 className={styles.headline}>
        {i18n.text('checkout.shippingMethod.title')}
      </h3>
      <ConditionalWrapper
        condition={isIOSTheme()}
        wrapper={children =>
          <Card className={styles.iOSCard}>
            {children}
          </Card>
          }
      >
        { shippingMethods.length === 1 ? (
          <div className={classNames(styles.container, styles.containerSingle)}>
            <ShippingMethod shippingMethod={shippingMethods[0]} />
          </div>
        ) : (
          <RadioGroup
            name="shipping-methods"
            value={selectedHash}
            onChange={onChange}
            component="ul"
            classes={{ root: styles.container }}
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
      </ConditionalWrapper>
    </div>
  );
};

ShippingMethods.propTypes = {
  orderHasDirectShipItems: PropTypes.bool,
};

ShippingMethods.defaultProps = {
  orderHasDirectShipItems: false,
};

export default hot(connect(ShippingMethods));
