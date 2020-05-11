import React, { Fragment, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { i18n, LoadingProvider } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { ResponsiveContainer, FormBuilder, RippleButton } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { CHECKOUT_BILLING_PATTERN } from '../../constants/routes';
import { styles as formStyles } from '../Form';
import generateFormConfig from './CheckoutBillingChange.config';
import connect from './CheckoutBillingChange.connector';
import billingConstraints from './CheckoutBillingChange.constraints';

const styles = {
  headline: css({
    marginTop: 16,
    padding: 16,
    fontSize: '2rem',
    margin: 0,
    lineHeight: 1,
  }),
  form: css({
    ...formStyles,
  }).toString(),
  root: css({
    display: 'flex',
    flexDirection: 'row',
    margin: 16,
  }),
  left: css({
    flex: 1,
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      paddingRight: 16,
    },
  }),
  right: css({
    [responsiveMediaQuery('>=md', { webOnly: true })]: {
      marginTop: 16,
      flex: 0.6,
    },
  }),
};
/**
 *
 * Converts validation errors into errors for form builder.
 * @param {Object} validationErrors The validation errors.
 * @returns {Array}
 */
const convertValidationErrors = validationErrors => Object
  .keys(validationErrors)
  .map(key => ({
    path: key,
    message: i18n.text(validationErrors[key]),
  }));

/**
 * Checkout billing.
 * @returns {JSX}
 */
const CheckoutBillingChange = ({
  order,
  updateCheckoutOrder,
  historyPop,
  billingAddress,
  shopSettings,
  userLocation,
  requiredFields,
  isDataReady,
}) => {
  // Create form config.
  const formConfig = useMemo(() => generateFormConfig(
    shopSettings?.supportedCountries,
    userLocation,
    requiredFields
  ), [requiredFields, shopSettings, userLocation]);

  // Determine values to prefill some form fields
  const userCountry = useMemo(
    () => userLocation?.country || appConfig?.marketId || null,
    [userLocation]
  );
  const userRegion = useMemo(() => userLocation?.region || null, [userLocation]);

  // Create validation rules based on required fields.
  const billingValidationRules = useMemo(
    () => mapValues(billingConstraints, (constraint, field) => {
      const isRequired = requiredFields.includes(field);
      return {
        ...constraint,
        presence: isRequired ? constraint.presence : undefined,
      };
    }), [requiredFields]
  );

  // Form submit
  const handleSubmit = useCallback(async (values) => {
    // Update order to set pickup contact.
    LoadingProvider.setLoading(CHECKOUT_BILLING_PATTERN);
    try {
      await updateCheckoutOrder({
        addressSequences: order.addressSequences.map(
          (address, index) => (index === order.primaryBillToAddressSequenceIndex ? {
            type: 'billing',
            firstName: values.firstName,
            lastName: values.lastName,
            mobile: values.mobile,
            emailAddress: values.emailAddress,
            company: values.company || undefined,
            address1: values.address1,
            address2: values.address2 || undefined,
            country: values.country,
            postalCode: values.postalCode,
            city: values.city,
            region: values.region,
          } : address)
        ),
      });
    } catch (error) {
      LoadingProvider.resetLoading(CHECKOUT_BILLING_PATTERN);
      return;
    }

    LoadingProvider.resetLoading(CHECKOUT_BILLING_PATTERN);
    historyPop();
  }, [
    historyPop,
    order,
    updateCheckoutOrder,
  ]);

  // Create form state.
  const defaultState = useMemo(() => ({
    country: userCountry,
    region: userRegion,
    ...(pickBy(billingAddress || {}, identity)),
  }), [billingAddress, userCountry, userRegion]);
  const formState = useFormState(
    defaultState,
    handleSubmit,
    billingValidationRules
  );
  const validationState = convertValidationErrors(formState.validationErrors || {});

  if (!isDataReady) {
    return null;
  }

  return (
    <Fragment>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <h1 className={styles.headline}>
          {i18n.text('titles.checkout_change_billing')}
        </h1>
      </ResponsiveContainer>
      <div className={styles.root}>
        <div className={styles.left}>
          <FormBuilder
            className={styles.form}
            name="BillingForm"
            config={formConfig}
            defaults={defaultState}
            validationErrors={validationState}
            handleUpdate={formState.setValues}
          />
          <RippleButton
            type="secondary"
            onClick={formState.handleSubmit}
            disabled={false}
          >
            {i18n.text('checkout.billing.save')}
          </RippleButton>
        </div>
        <div className={styles.right} />
      </div>
    </Fragment>
  );
};

CheckoutBillingChange.propTypes = {
  historyPop: PropTypes.func.isRequired,
  updateCheckoutOrder: PropTypes.func.isRequired,
  billingAddress: PropTypes.shape(),
  isDataReady: PropTypes.bool,
  order: PropTypes.shape(),
  requiredFields: PropTypes.arrayOf(PropTypes.shape()),
  shopSettings: PropTypes.shape(),
  userLocation: PropTypes.shape(),
};

CheckoutBillingChange.defaultProps = {
  order: null,
  billingAddress: null,
  shopSettings: null,
  userLocation: null,
  requiredFields: [],
  isDataReady: false,
};

export default connect(CheckoutBillingChange);
