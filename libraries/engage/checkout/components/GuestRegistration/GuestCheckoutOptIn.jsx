import React, { useMemo, useCallback, useEffect } from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';
import { isIOSTheme } from '@shopgate/engage/core';
import Section from '../Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import generateFormConfig from './GuestCheckoutOptIn.config';
import { styles as formStyles } from '../Form';

const { variables } = themeConfig;

const styles = {
  root: css({
    padding: `0 ${variables.gap.big}px`,
    ...(!isIOSTheme() ? {
      paddingBottom: variables.gap.xbig,
    } : {}),
  }).toString(),
  form: css({
    ' .guestCheckoutOptInMarketingOptIn .checkbox': {
      paddingBottom: 0,
    },
    ...formStyles,
  }).toString(),
  section: css({
    margin: variables.gap.big,
  }).toString(),
};

/**
 * @returns {JSX}
 */
const GuestCheckoutOptIn = () => {
  const {
    defaultOptInFormState,
    optInFormSetValues,
    setUpdateOptIns,
  } = useCheckoutContext();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setUpdateOptIns();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */
  const formConfig = useMemo(
    () => generateFormConfig(),
    []
  );

  const handleUpdate = useCallback((values) => {
    optInFormSetValues(values);
  }, [optInFormSetValues]);

  return (
    <div className={styles.root}>
      <Section hasForm>
        <FormBuilder
          className={styles.form}
          name="GuestCheckoutOptIn"
          config={formConfig}
          defaults={defaultOptInFormState}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default GuestCheckoutOptIn;
