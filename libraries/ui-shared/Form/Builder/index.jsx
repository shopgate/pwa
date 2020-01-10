import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { logger } from '@shopgate/pwa-core/helpers';
import Portal from '@shopgate/pwa-common/components/Portal';
import Form from '@shopgate/pwa-ui-shared/Form';
import {
  BEFORE,
  AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import ActionListener from './classes/ActionListener';
import {
  ELEMENT_TYPE_EMAIL,
  ELEMENT_TYPE_PASSWORD,
  ELEMENT_TYPE_TEXT,
  ELEMENT_TYPE_NUMBER,
  ELEMENT_TYPE_SELECT,
  ELEMENT_TYPE_COUNTRY,
  ELEMENT_TYPE_PROVINCE,
  ELEMENT_TYPE_CHECKBOX,
  ELEMENT_TYPE_RADIO,
  ELEMENT_TYPE_DATE,
  ELEMENT_TYPE_PHONE,
} from './elementTypes';
import TextElement from './components/TextElement';
import SelectElement from './components/SelectElement';
import CountryElement from './components/CountryElement';
import ProvinceElement from './components/ProvinceElement';
import RadioElement from './components/RadioElement';
import CheckboxElement from './components/CheckboxElement';
import buildFormElements from './builders/buildFormElements';
import buildFormDefaults from './builders/buildFormDefaults';
import buildCountryList from './builders/buildCountryList';
import buildProvinceList from './builders/buildProvinceList';
import buildValidationErrorList from './builders/buildValidationErrorList';

/**
 * Takes a string and converts it to a part to be used in a portal name
 * @package FormBuilder
 * @param {string} s The string to be sanitized
 * @return {string}
 */
const sanitize = s => s.replace(/[\\._]/, '-');
/**
 * Optional select element
 * @type {Object}
 */
const emptySelectOption = {
  '': '',
};

/**
 * Takes a form configuration and handles rendering and updates of the form fields.
 * Note: Only one country and one province element is supported per FormBuilder instance.
 */
class Builder extends Component {
  static propTypes = {
    config: PropTypes.shape().isRequired,
    handleUpdate: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    defaults: PropTypes.shape(),
    onSubmit: PropTypes.func,
    validationErrors: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      message: PropTypes.string,
    })),
  }

  static defaultProps = {
    className: '',
    defaults: {},
    onSubmit: () => { },
    validationErrors: [],
  }

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    // Prepare internal state
    this.state = {
      elementVisibility: {},
      formData: {},
      // Convert errors structure to direct access errors
      errors: buildValidationErrorList(props.validationErrors),
    };

    // Reorganize form elements into a structure that can be easily rendered
    const formElements = buildFormElements(props.config, this.elementChangeHandler);
    // Compute defaults
    const formDefaults = buildFormDefaults(formElements, props.defaults);
    // Assign defaults to state
    this.state.formData = formDefaults;

    // Handle fixed visibilities
    formElements.forEach((element) => {
      // Assume as visible except it's explicitly set to "false"
      this.state.elementVisibility[element.id] = element.visible !== false;
    });

    this.actionListener = new ActionListener(buildProvinceList, formDefaults);
    this.actionListener.attachAll(formElements);

    // Sort the elements after attaching action listeners to keep action hierarchy same as creation
    this.formElements = formElements.sort(this.elementSortFunc);

    // Assemble combined country/province list based on the config element
    const countryElement = this.formElements.find(el => el.type === ELEMENT_TYPE_COUNTRY);
    if (countryElement) {
      this.countryList = buildCountryList(countryElement, emptySelectOption);
      const provinceElement = this.formElements.find(el => el.type === ELEMENT_TYPE_PROVINCE);
      if (provinceElement
        && provinceElement.required
        && !!formDefaults[countryElement.id]
        && !formDefaults[provinceElement.id]) {
        // Set default for province field for given country
        const [first] = Object.values(buildProvinceList(formDefaults[countryElement.id]));
        if (first) {
          this.state.formData[provinceElement.id] = first;
        }
      }
    }

    // Final form initialization, by triggering actionListeners and enable rendering for elements
    let newState = this.state;
    this.formElements.forEach((element) => {
      newState = this.actionListener.notify(element.id, this.state, newState);
    });
    this.state = newState;
  }

  /**
   * Sorts the elements by "sortOrder" property
   *
   * @typedef {Object} FormElement
   * @property {number} sortOrder
   *
   * @param {FormElement} element1 First element
   * @param {FormElement} element2 Second element
   * @returns {number}
   */
  elementSortFunc = (element1, element2) => {
    // Keep current sort order when no specific sort order was set for both
    if (element1.sortOrder === undefined || element2.sortOrder === undefined) {
      return 0;
    }

    // Sort in ascending order of sortOrder otherwise
    return element1.sortOrder - element2.sortOrder;
  };

  /**
   * Element change handler based on it's type,
   * @param {string} elementId Element to create the handler for
   * @param {string} value Element value
   */
  elementChangeHandler = (elementId, value) => {
    // Apply value change to new state
    const newState = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [elementId]: value,
      },
    };

    // Remove validation error message on first change of the element
    Object.keys(newState.errors).forEach((key) => {
      // Action listeners might add some again
      if (this.state.formData[key] !== newState.formData[key]) {
        delete newState.errors[key];
      }
    });
    const hasBackendValidationErrors = Object.keys(newState.errors).length > 0;

    // Handle context sensitive functionality by via "action" listener and use the "new" state
    const updatedState = this.actionListener.notify(elementId, this.state, newState);

    // TODO: handle frontend validation errors and set "hasErrors" accordingly
    let hasErrors = false;

    // Check "required" fields for all visible elements and enable rendering on changes
    this.formElements.forEach((formElement) => {
      if (!updatedState.elementVisibility[formElement.id] || !formElement.required) {
        return;
      }

      const tmpVal = updatedState.formData[formElement.id];
      const tmpResult = tmpVal === null || tmpVal === undefined || tmpVal === '' || tmpVal === false;
      hasErrors = hasErrors || tmpResult;
    });

    const hasFrontendValidationErrors = Object.keys(updatedState.errors).length <= 0;
    const hasValidationErrors = hasBackendValidationErrors && hasFrontendValidationErrors;

    // Handle state internally and send an "onChange" event to parent if this finished
    this.setState(updatedState);

    // Transform to external structure (unavailable ones will be set undefined)
    const updateData = {};
    this.formElements.forEach((el) => {
      if (el.custom) {
        if (updateData.customAttributes === undefined) {
          updateData.customAttributes = {};
        }
        updateData.customAttributes[el.id] = updatedState.formData[el.id];
      } else {
        updateData[el.id] = updatedState.formData[el.id];
      }
    });

    // Trigger the given update action
    this.props.handleUpdate(updateData, hasErrors || hasValidationErrors);
  };

  /**
   * Handles response of validation errors
   * @param {Object} nextProps The new props object with changed data
   */
  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const oldValidationErrors = buildValidationErrorList(this.props.validationErrors);
    const newValidationErrors = buildValidationErrorList(nextProps.validationErrors);
    if (!isEqual(oldValidationErrors, newValidationErrors)) {
      this.setState({ errors: newValidationErrors });
    }
  }

  /**
   * Takes an element of any type and renders it depending on type.
   * Also puts portals around the element.
   * @param {Object} element The data of the element to be rendered
   * @returns {JSX}
   */
  renderElement = (element) => {
    const elementName = `${this.props.name}.${element.id}`;
    const elementErrorText = this.state.errors[element.id] || '';
    const elementValue = this.state.formData[element.id];
    const elementVisible = this.state.elementVisibility[element.id] || false;

    if (!elementVisible) {
      return null;
    }

    /*
     * Elements do check the type before they render themselves, but not even trying to render
     * creates a better React DOM
     */
    switch (element.type) {
      case ELEMENT_TYPE_TEXT:
      case ELEMENT_TYPE_NUMBER:
      case ELEMENT_TYPE_EMAIL:
      case ELEMENT_TYPE_PASSWORD:
      case ELEMENT_TYPE_DATE:
      case ELEMENT_TYPE_PHONE: {
        return (
          <TextElement
            name={elementName}
            element={element}
            errorText={elementErrorText}
            value={elementValue || ''}
            visible={elementVisible}
          />
        );
      }

      case ELEMENT_TYPE_SELECT: return (
        <SelectElement
          name={elementName}
          element={element}
          errorText={elementErrorText}
          value={elementValue}
          visible={elementVisible}
        />
      );

      case ELEMENT_TYPE_COUNTRY: return (
        <CountryElement
          name={elementName}
          element={element}
          errorText={elementErrorText}
          value={elementValue}
          visible={elementVisible}
          countryList={this.countryList}
        />
      );

      case ELEMENT_TYPE_PROVINCE: {
        const countryElement = this.formElements.find(el => el.type === ELEMENT_TYPE_COUNTRY);
        const provincesList = countryElement && this.state.formData[countryElement.id]
          ? buildProvinceList(
            this.state.formData[countryElement.id],
            element.required ? null : emptySelectOption
          )
          : {};

        return (
          <ProvinceElement
            name={elementName}
            element={element}
            errorText={elementErrorText}
            value={elementValue}
            visible={elementVisible}
            provincesList={provincesList}
          />
        );
      }

      case ELEMENT_TYPE_RADIO: {
        return (
          <RadioElement
            name={elementName}
            element={element}
            errorText={elementErrorText}
            value={elementValue}
            visible={elementVisible}
          />
        );
      }

      case ELEMENT_TYPE_CHECKBOX: {
        return (
          <CheckboxElement
            name={elementName}
            element={element}
            errorText={elementErrorText}
            value={elementValue}
            visible={elementVisible}
          />
        );
      }

      default: {
        logger.error(`Unknown form element type: ${element.type}`);
        break;
      }
    }

    return null;
  };

  /**
   * Renders the component based on the given config
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        <Form onSubmit={this.props.onSubmit}>
          <div className={this.props.className}>
            {this.formElements.map(element => (
              <Fragment key={`${this.props.name}.${element.id}`}>
                <Portal
                  name={`${sanitize(this.props.name)}.${sanitize(element.id)}.${BEFORE}`}
                />
                <Portal name={`${sanitize(this.props.name)}.${sanitize(element.id)}`}>
                  {this.renderElement(element)}
                </Portal>
                <Portal
                  name={`${sanitize(this.props.name)}.${sanitize(element.id)}.${AFTER}`}
                />
              </Fragment>
            ))}
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default Builder;
