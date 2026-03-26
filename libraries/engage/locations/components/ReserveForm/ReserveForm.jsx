import 'react-phone-number-input/style.css';
import React, {
  useState, useContext, useMemo, useRef, useLayoutEffect, useCallback,
} from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  TextField, RippleButton, RadioGroup, RadioGroupItem, ProgressBar,
} from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { useFormState } from '../../../core/hooks/useFormState';
import { FulfillmentContext } from '../../locations.context';
import { ReserveFormPhone } from './ReserveFormPhone';
import { constraints } from './ReserveForm.constraints';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  form: {
    background: colors.background,
    padding: theme.spacing(1.5, 1.5, 2),
    boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
  },
  formHeading: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    margin: theme.spacing(0, 0, 1),
  },
  fieldset: {
    padding: 0,
    margin: theme.spacing(0, 0, 2),
    border: 0,
  },
  formField: {
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  pickerSwitch: {
    marginTop: '-1rem',
  },
  pickerItem: {
    paddingRight: theme.spacing(4),
    ':last-of-type': {
      paddingRight: 0,
    },
  },
  button: {
    width: '100%',
  },
  progressBar: {
    height: '4px',
    position: 'relative',
  },
}));
// eslint-disable-next-line max-len
/** @typedef {import('@shopgate/engage/locations/locations.types').ReservationFormValues} ReservationFormValues */

const PICKUP_PERSON_ME = 'me';
const PICKUP_PERSON_OTHER = 'someoneelse';

/**
 * Determines the pick up person.
 * @param {ReservationFormValues|null} userInput The current user input
 * @return {string}
 */
const determinePickupPerson = (userInput) => {
  if (!userInput) {
    return PICKUP_PERSON_ME;
  }

  const meFields = ['firstName', 'lastName', 'email', 'cellPhone'];
  const otherFields = ['firstName2', 'lastName2', 'email2', 'cellPhone2'];
  const hasMeFields = meFields.every(field => typeof userInput[field] !== 'undefined');
  const hasOtherFields = otherFields.every(field => typeof userInput[field] !== 'undefined');

  if (!hasOtherFields || !hasMeFields) {
    return PICKUP_PERSON_ME;
  }

  const valuesEqual = meFields.every(
    (field, index) => userInput[field] === userInput[otherFields[index]]
  );

  return valuesEqual ? PICKUP_PERSON_ME : PICKUP_PERSON_OTHER;
};

/**
 * Renders the quick reservation form.
 * @returns {JSX.Element}
 */
function ReserveFormUnwrapped() {
  const { classes } = useStyles();
  const { sendReservation, userInput } = useContext(FulfillmentContext);
  const [picker, setPicker] = useState(determinePickupPerson(userInput));

  /** @type {ReservationFormValues} */
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

  const validationConstraints = useMemo(() => ({
    ...constraints,
    ...picker === PICKUP_PERSON_OTHER && {
      firstName2: constraints.firstName,
      lastName2: constraints.lastName,
      cellPhone2: constraints.cellPhone,
      email2: constraints.email,
    },
  }), [picker]);

  /** @type {ReservationFormValues} */
  const initialState = userInput ? {
    ...defaultState,
    ...userInput,
  } : defaultState;

  /**
   * @param {Object} values The form values.
   */
  /** @param {ReservationFormValues} values */
  const complete = useCallback(async (values) => {
    const response = values;

    if (picker === PICKUP_PERSON_ME) {
      response.firstName2 = response.firstName;
      response.lastName2 = response.lastName;
      response.cellPhone2 = response.cellPhone;
      response.email2 = response.email;
    } else {
      response.firstName2 = response.firstName2 || response.firstName;
      response.lastName2 = response.lastName2 || response.lastName;
      response.cellPhone2 = response.cellPhone2 || response.cellPhone;
      response.email2 = response.email2 || response.email;
    }

    await sendReservation(response);
  }, [picker, sendReservation]);

  const {
    values, handleChange, handleSubmit, changed, valid, validationErrors = {}, isSubmitting,
  } = useFormState(initialState, complete, validationConstraints);

  const someoneElseRef = useRef(null);
  useLayoutEffect(() => {
    if (someoneElseRef.current && picker === PICKUP_PERSON_OTHER) {
      someoneElseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [picker, someoneElseRef]);

  return (
    <>
      <div className={classes.progressBar}>
        <ProgressBar isVisible={isSubmitting} />
      </div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <fieldset className={classes.fieldset}>
          <TextField
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            label={i18n.text('locations.firstName')}
            className={classes.formField}
            errorText={i18n.text(validationErrors.firstName)}
          />
          <TextField
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            label={i18n.text('locations.lastName')}
            className={classes.formField}
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
            className={classes.formField}
            errorText={i18n.text(validationErrors.email)}
          />
        </fieldset>
        <p className={classes.formHeading}>
          {i18n.text('locations.who_will_pickup')}
        </p>
        <div className={classes.pickerSwitch}>
          <RadioGroup name="picker" direction="row" value={picker} onChange={setPicker}>
            <RadioGroupItem
              label={i18n.text('locations.me')}
              name={PICKUP_PERSON_ME}
              className={classes.pickerItem}
            />
            <RadioGroupItem
              label={i18n.text('locations.someone_else')}
              name={PICKUP_PERSON_OTHER}
              className={classes.pickerItem}
            />
          </RadioGroup>
        </div>
        {(picker === PICKUP_PERSON_OTHER) && (
          <fieldset className={classes.fieldset} ref={someoneElseRef}>
            <TextField
              name="firstName2"
              value={values.firstName2}
              onChange={handleChange}
              label={i18n.text('locations.firstName')}
              className={classes.formField}
              errorText={i18n.text(validationErrors.firstName2)}
            />
            <TextField
              name="lastName2"
              value={values.lastName2}
              onChange={handleChange}
              label={i18n.text('locations.lastName')}
              className={classes.formField}
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
              className={classes.formField}
              errorText={i18n.text(validationErrors.email2)}
            />
          </fieldset>
        )}
        <RippleButton
          type="secondary"
          disabled={changed || valid === false || isSubmitting}
          className={classes.button}
        >
          {i18n.text('locations.place_reservation')}
        </RippleButton>
      </form>
    </>
  );
}

export const ReserveForm = ReserveFormUnwrapped;
