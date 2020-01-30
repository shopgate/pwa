import React, { useState } from 'react';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import RadioGroup from '@shopgate/pwa-ui-shared/Form/RadioGroup';
import RadioGroupItem from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { useFormState } from '../../../core/hooks/useFormState';
import { i18n } from '../../../core/helpers/i18n';
import {
  form, fieldset, formField, formHeading, pickerSwitch, pickerItem, button,
} from './style';

/**
 * @returns {JSX}
 */
function ReserveForm() {
  const [picker, setPicker] = useState('me');

  const initialState = {
    firstName: '',
    lastName: '',
    cellPhone: '',
    email: '',
    firstName2: '',
    lastName2: '',
    cellPhone2: '',
    email2: '',
  };

  /**
   * @param {Object} values The form values.
   */
  const complete = (values) => {
    console.warn(values);
  };

  const {
    values, handleChange, handleSubmit, changed,
  } = useFormState(initialState, complete);

  return (
    <form onSubmit={handleSubmit} className={form}>
      <p className={formHeading}>Reservation Contact Information</p>
      <fieldset className={fieldset}>
        <TextField
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          label="First Name"
          className={formField}
        />
        <TextField
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          label="Last Name"
          className={formField}
        />
        <TextField
          name="cellPhone"
          value={values.cellPhone}
          onChange={handleChange}
          label="Cell Number"
          className={formField}
        />
        <TextField
          name="email"
          value={values.email}
          onChange={handleChange}
          label="Email Address"
          className={formField}
        />
      </fieldset>
      <p className={formHeading}>Who will pick up this order?</p>
      <div className={pickerSwitch}>
        <RadioGroup name="picker" direction="row" value="me" onChange={setPicker}>
          <RadioGroupItem
            label="Me"
            name="me"
            className={pickerItem}
          />
          <RadioGroupItem
            label="Someone else"
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
            label="First Name"
            className={formField}
          />
          <TextField
            name="lastName2"
            value={values.lastName2}
            onChange={handleChange}
            label="Last Name"
            className={formField}
          />
          <TextField
            name="cellPhone2"
            value={values.cellPhone2}
            onChange={handleChange}
            label="Cell Number"
            className={formField}
          />
          <TextField
            name="email2"
            value={values.email2}
            onChange={handleChange}
            label="Email Address"
            className={formField}
          />
        </fieldset>
      )}
      <RippleButton
        type="secondary"
        disabled={changed}
        className={button}
      >
        {i18n.text('product.location.place_reservation')}
      </RippleButton>
    </form>
  );
}

export default ReserveForm;
