// @flow
import { hot } from 'react-hot-loader/root';
import 'react-phone-number-input/style.css';
import React, {
  useState, useContext, useMemo, useRef, useLayoutEffect, useCallback, Fragment,
} from 'react';
import {
  TextField, RippleButton, RadioGroup, RadioGroupItem, ProgressBar,
} from '@shopgate/engage/components';
import { useFormState } from '../../../core/hooks/useFormState';
import { i18n } from '../../../core/helpers/i18n';
import { FulfillmentContext } from '../../locations.context';
import { type ReservationFormValues } from '../../locations.types';
import { ReserveFormPhone } from './ReserveFormPhone';
import { constraints } from './ReserveForm.constraints';
import {
  form, fieldset, formField, formHeading, pickerSwitch, pickerItem, button, progressBar,
} from './ReserveForm.style';

/**
 * Renders the quick reservation form.
 * @returns {JSX}
 */
function ReserveFormUnwrapped() {
  const { sendReservation, userInput } = useContext(FulfillmentContext);
  const [picker, setPicker] = useState('me');

  const defaultState: ReservationFormValues = {
    firstName: '',
    lastName: '',
    cellPhone: '',
    email: '',
    firstName2: '',
    lastName2: '',
    cellPhone2: '',
    email2: '',
  };

  const validationConstraints = useMemo(() => ({
    ...constraints,
    ...picker === 'someoneelse' && {
      firstName2: constraints.firstName,
      lastName2: constraints.lastName,
      cellPhone2: constraints.cellPhone,
      email2: constraints.email,
    },
  }), [picker]);

  const initialState: ReservationFormValues = userInput ? {
    ...defaultState,
    ...userInput,
  } : defaultState;

  /**
   * @param {Object} values The form values.
   */
  const complete = useCallback(async (values: ReservationFormValues) => {
    const response = values;

    response.firstName2 = response.firstName2 || response.firstName;
    response.lastName2 = response.lastName2 || response.lastName;
    response.cellPhone2 = response.cellPhone2 || response.cellPhone;
    response.email2 = response.email2 || response.email;

    await sendReservation(response);
  }, [sendReservation]);

  const {
    values, handleChange, handleSubmit, changed, valid, validationErrors = {}, isSubmitting,
  } = useFormState(initialState, complete, validationConstraints);

  const someoneElseRef = useRef(null);
  useLayoutEffect(() => {
    if (someoneElseRef.current && picker === 'someoneelse') {
      someoneElseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [picker, someoneElseRef]);

  return (
    <Fragment>
      <div className={progressBar}>
        <ProgressBar isVisible={isSubmitting} />
      </div>
      <form onSubmit={handleSubmit} className={form}>
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
          <ReserveFormPhone
            name="cellPhone"
            value={values.cellPhone}
            onChange={handleChange}
            label={i18n.text('locations.cellPhone')}
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
          <fieldset className={fieldset} ref={someoneElseRef}>
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
            <ReserveFormPhone
              name="cellPhone2"
              value={values.cellPhone2}
              onChange={handleChange}
              label={i18n.text('locations.cellPhone')}
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
          disabled={changed || valid === false || isSubmitting}
          className={button}
        >
          {i18n.text('locations.place_reservation')}
        </RippleButton>
      </form>
    </Fragment>
  );
}

export const ReserveForm = hot(ReserveFormUnwrapped);
