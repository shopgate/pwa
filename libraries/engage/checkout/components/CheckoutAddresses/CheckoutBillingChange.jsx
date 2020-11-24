import React, {
  Fragment, useState, useMemo, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { i18n } from '@shopgate/engage/core';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { ResponsiveContainer, FormBuilder, RippleButton } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { StylePresets } from '@shopgate/engage/components/Form';
import { ResponsiveBackButton } from '../ResponsiveBackButton';
import generateFormConfig from './CheckoutBillingChange.config';
import connect from './CheckoutBillingChange.connector';
import billingConstraints from './CheckoutBillingChange.constraints';

const styles = {
  headline: css({
    padding: 16,
    fontSize: '2.125rem',
    fontWeight: 'normal',
    margin: 0,
    lineHeight: '2.25rem',
  }),
  form: css({
    ...StylePresets.OUTLINED_FORM_FIELDS,
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
  buttonWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 auto',
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
  updateBilling,
  historyPop,
  billingAddress,
  shopSettings,
  userLocation,
  requiredFields,
  isDataReady,
}) => {
  const formContainerRef = useRef(null);
  // Local state.
  const [isLocked, setLocked] = useState(false);

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
    setLocked(true);
    const success = await updateBilling({ contact: values });
    if (success) {
      historyPop();
    }
    setLocked(false);
  }, [
    historyPop,
    updateBilling,
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
    billingValidationRules,
    formContainerRef
  );
  const validationState = convertValidationErrors(formState.validationErrors || {});

  if (!isDataReady) {
    return null;
  }

  return (
    <Fragment>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <ResponsiveBackButton />
        <h1 className={styles.headline}>
          {i18n.text('titles.checkout_change_billing')}
        </h1>
      </ResponsiveContainer>
      <div className={styles.root}>
        <div className={styles.left} ref={formContainerRef}>
          <FormBuilder
            className={styles.form}
            name="BillingForm"
            config={formConfig}
            defaults={defaultState}
            validationErrors={validationState}
            handleUpdate={formState.setValues}
          />
          <div className={styles.buttonWrapper}>
            <RippleButton
              type="secondary"
              onClick={formState.handleSubmit}
              disabled={isLocked}
            >
              {i18n.text('checkout.billing.save')}
            </RippleButton>
          </div>

        </div>
        <div className={styles.right} />
      </div>
    </Fragment>
  );
};

CheckoutBillingChange.propTypes = {
  historyPop: PropTypes.func.isRequired,
  updateBilling: PropTypes.func.isRequired,
  billingAddress: PropTypes.shape(),
  isDataReady: PropTypes.bool,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
  shopSettings: PropTypes.shape(),
  userLocation: PropTypes.shape(),
};

CheckoutBillingChange.defaultProps = {
  billingAddress: null,
  shopSettings: null,
  userLocation: null,
  requiredFields: [],
  isDataReady: false,
};

export default connect(CheckoutBillingChange);
