import React, { useState, useContext, useMemo } from 'react';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import RadioGroup from '@shopgate/pwa-ui-shared/Form/RadioGroup';
import RadioGroupItem from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { useFormState } from '../../../core/hooks/useFormState';
import { VALIDATION_EMAIL, VALIDATION_PHONE, VALIDATION_REQUIRED } from '../../../core/validation';
import { i18n } from '../../../core/helpers/i18n';
import FulfillmentContext from '../context';
import {
  form, fieldset, formField, formHeading, pickerSwitch, pickerItem, button,
} from './ReserveForm.style';

/**
 * @returns {JSX}
 */
function ReserveForm() {
  const { sendReservation, userInput } = useContext(FulfillmentContext);
  const [picker, setPicker] = useState('me');

  const defaultState = {
    firstName: '',
    lastName: '',
    cellPhone: '',
    email: '',
    firstName2: '',
    lastName2: '',
    cellPhone2: '',
    email2: '',
  };

  const validationRules = useMemo(() => ({
    firstName: VALIDATION_REQUIRED,
    lastName: VALIDATION_REQUIRED,
    cellPhone: [VALIDATION_REQUIRED, VALIDATION_PHONE],
    email: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
    ...picker === 'someoneelse' && {
      firstName2: VALIDATION_REQUIRED,
      lastName2: VALIDATION_REQUIRED,
      cellPhone2: [VALIDATION_REQUIRED, VALIDATION_PHONE],
      email2: [VALIDATION_REQUIRED, VALIDATION_EMAIL],
    },
  }), [picker]);

  const initialState = userInput ? {
    ...defaultState,
    ...userInput,
  } : defaultState;

  /**
   * @param {Object} values The form values.
   */
  const complete = (values) => {
    const response = values;

    if (response.firstName2 === '') {
      response.firstName2 = response.firstName;
    }
    if (response.lastName2 === '') {
      response.lastName2 = response.lastName;
    }
    if (response.cellPhone2 === '') {
      response.cellPhone2 = response.cellPhone;
    }
    if (response.email2 === '') {
      response.email2 = response.email;
    }

    sendReservation(response);
  };

  const {
    values, handleChange, handleSubmit, changed, valid, validationErrors,
  } = useFormState(initialState, complete, validationRules);

  return (
    <form onSubmit={handleSubmit} className={form}>
      <p className={formHeading}>
        {i18n.text('locations.create_order')}
      </p>
      <fieldset className={fieldset}>
        <TextField
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          label={i18n.text('locations.firstName')}
          className={formField}
          errorText={i18n.text(validationErrors.firstName)}
        />
        <TextField
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          label={i18n.text('locations.lastName')}
          className={formField}
          errorText={i18n.text(validationErrors.lastName)}
        />
        <TextField
          name="cellPhone"
          value={values.cellPhone}
          onChange={handleChange}
          label={i18n.text('locations.cellPhone')}
          className={formField}
          errorText={i18n.text(validationErrors.cellPhone)}
        />
        <TextField
          name="email"
          value={values.email}
          onChange={handleChange}
          label={i18n.text('locations.emailAddress')}
          className={formField}
          errorText={i18n.text(validationErrors.email)}
        />
      </fieldset>
      <p className={formHeading}>
        {i18n.text('locations.who_will_pickup')}
      </p>
      <div className={pickerSwitch}>
        <RadioGroup name="picker" direction="row" value="me" onChange={setPicker}>
          <RadioGroupItem
            label={i18n.text('locations.me')}
            name="me"
            className={pickerItem}
          />
          <RadioGroupItem
            label={i18n.text('locations.someone_else')}
            name="someoneelse"
            className={pickerItem}
          />
        </RadioGroup>
      </div>
      {(picker === 'someoneelse') && (
        <fieldset className={fieldset}>
          <TextField
            name="firstName2"
            value={values.firstName2}
            onChange={handleChange}
            label={i18n.text('locations.firstName')}
            className={formField}
            errorText={i18n.text(validationErrors.firstName2)}
          />
          <TextField
            name="lastName2"
            value={values.lastName2}
            onChange={handleChange}
            label={i18n.text('locations.lastName')}
            className={formField}
            errorText={i18n.text(validationErrors.lastName2)}
          />
          <TextField
            name="cellPhone2"
            value={values.cellPhone2}
            onChange={handleChange}
            label={i18n.text('locations.cellPhone')}
            className={formField}
            errorText={i18n.text(validationErrors.cellPhone2)}
          />
          <TextField
            name="email2"
            value={values.email2}
            onChange={handleChange}
            label={i18n.text('locations.emailAddress')}
            className={formField}
            errorText={i18n.text(validationErrors.email2)}
          />
        </fieldset>
      )}
      <RippleButton
        type="secondary"
        disabled={changed || !valid}
        className={button}
      >
        {i18n.text('locations.place_reservation')}
      </RippleButton>
    </form>
  );
}

export default ReserveForm;
