import React, { Fragment, useMemo } from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import CheckoutHeader from '../../../checkout/components/Checkout/CheckoutHeader';
import RegistrationFormBilling from '../Registration/RegistrationFormBilling';
import RegistrationFormShipping from '../Registration/RegistrationFormShipping';
import RegistrationFormExtra from '../Registration/RegistrationFormExtra';
import RegistrationFormToggle from '../Registration/RegistrationFormToggle';
import RegistrationFormActions from '../Registration/RegistrationFormActions';
import RegistrationFormPickup from './GuestRegistrationFormPickup';
import { useRegistration } from '../../hooks';

const { variables } = themeConfig;

const styles = {
  container: css({
    padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    '@media(min-width: 768px)': {
      width: '50%',
      paddingRight: 0,
    },
  }),
};

/**
 * The GuestRegistrationContent component.
 * @returns {JSX}
 */
const GuestRegistrationContent = () => {
  const {
    orderReserveOnly,
    guestRegistrationEditMode,
  } = useRegistration(true);

  const headline = useMemo(() => {
    if (guestRegistrationEditMode) {
      return orderReserveOnly ? 'checkout.change_contacts' : 'checkout.change_addresses';
    }

    return 'titles.checkout';
  }, [guestRegistrationEditMode, orderReserveOnly]);

  return (
    <Fragment>
      <CheckoutHeader
        stepFrom={!guestRegistrationEditMode ? 1 : null}
        stepTo={!guestRegistrationEditMode ? 2 : null}
        headline={headline}
      />
      <div className={styles.container}>
        <RegistrationFormBilling isGuest />
        <RegistrationFormToggle isGuest />
        <RegistrationFormShipping isGuest />
        <RegistrationFormExtra isGuest />
        <RegistrationFormPickup />
      </div>
      <RegistrationFormActions isGuest />
    </Fragment>
  );
};

export default GuestRegistrationContent;
