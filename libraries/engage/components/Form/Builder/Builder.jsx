import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import { logger } from '@shopgate/pwa-core/helpers';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  BEFORE,
  AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { Form } from '..';
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
  ELEMENT_TYPE_PHONE_PICKER,
} from './Builder.constants';
import ElementText from './ElementText';
import ElementSelect from './ElementSelect';
import ElementRadio from './ElementRadio';
import ElementCheckbox from './ElementCheckbox';
import ElementPhoneNumber from './ElementPhoneNumber';
import buildFormElements from './helpers/buildFormElements';
import buildFormDefaults from './helpers/buildFormDefaults';
import buildCountryList from './helpers/buildCountryList';
import buildProvinceList from './helpers/buildProvinceList';
import buildValidationErrorList from './helpers/buildValidationErrorList';

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
  static defaultElements = {
    [ELEMENT_TYPE_EMAIL]: ElementText,
    [ELEMENT_TYPE_PASSWORD]: ElementText,
    [ELEMENT_TYPE_TEXT]: ElementText,
    [ELEMENT_TYPE_NUMBER]: ElementText,
    [ELEMENT_TYPE_SELECT]: ElementSelect,
    [ELEMENT_TYPE_COUNTRY]: ElementSelect,
    [ELEMENT_TYPE_PROVINCE]: ElementSelect,
    [ELEMENT_TYPE_CHECKBOX]: ElementCheckbox,
    [ELEMENT_TYPE_RADIO]: ElementRadio,
    [ELEMENT_TYPE_DATE]: ElementText,
    [ELEMENT_TYPE_PHONE]: ElementText,
    [ELEMENT_TYPE_PHONE_PICKER]: ElementPhoneNumber,
  }

  static propTypes = {
    config: PropTypes.shape().isRequired,
    handleUpdate: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.string,
    ]),
    defaults: PropTypes.shape(),
    elements: PropTypes.shape(),
    onSubmit: PropTypes.func,
    validationErrors: PropTypes.arrayOf(PropTypes.shape({
      path: PropTypes.string,
      message: PropTypes.string,
    })),
  }

  static defaultProps = {
    className: null,
    defaults: {},
    elements: Builder.defaultElements,
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
        const [first] = Object.keys(buildProvinceList(formDefaults[countryElement.id]));
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
   * Retrieves a form element REACT component by the given type or null if the type is unknown.
   * @param {string} type The type value of the element to return.
   * @returns {*|ElementText|ElementSelect|ElementCheckbox|ElementRadio|null}
   */
  getFormElementComponent = type =>
    this.props.elements[type] || Builder.defaultElements[type] || null;

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
   * Element change handler based on it's type. It takes a state change and performs form actions on
   * in to allow customization. The final result is then written to the component state.
   * @param {string} elementId Element to create the handler for
   * @param {string} value Element value
   */
  elementChangeHandler = (elementId, value) => {
    // "newState" is the state changes before any form actions have been applied
    const newState = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [elementId]: value,
      },
    };

    // Handle context sensitive functionality by via "action" listener and use the "new" state
    const updatedNewState = this.actionListener.notify(elementId, this.state, newState);

    // Form actions can append validation errors by adding that field to the new state
    // Split out validation errors from final state and
    const { validationErrors = {}, ...finalState } = updatedNewState;

    // "hasErrors" is true, when a visible + required field is empty or validation errors appeared!
    let hasErrors = Object.keys(validationErrors).length > 0;

    // Check "required" fields for all visible elements and enable rendering on changes
    this.formElements.forEach((formElement) => {
      if (!finalState.elementVisibility[formElement.id] || !formElement.required) {
        return;
      }

      const tmpVal = finalState.formData[formElement.id];
      const tmpResult = tmpVal === null || tmpVal === undefined || tmpVal === '' || tmpVal === false;
      hasErrors = hasErrors || tmpResult;
    });

    // Handle state internally and send an "onChange" event to parent if this finished
    this.setState(finalState);

    // Transform to external structure (unavailable ones will be set undefined)
    const updateData = {};
    this.formElements.forEach((el) => {
      if (el.custom) {
        if (updateData.customAttributes === undefined) {
          updateData.customAttributes = {};
        }
        updateData.customAttributes[el.id] = finalState.formData[el.id];
      } else {
        updateData[el.id] = finalState.formData[el.id];
      }
    });

    // Trigger the given update action of the parent and provide all new validation errors to it
    this.props.handleUpdate(
      updateData,
      hasErrors,
      // Output validation errors in the same structure (array) as the component takes them
      hasErrors
        ? Object.keys(validationErrors).map(k => ({
          path: k,
          message: validationErrors[k],
        }))
        : []
    );
  };

  /**
   * Takes an element of any type and renders it depending on type.
   * Also puts portals around the element.
   * @param {Object} element The data of the element to be rendered
   * @param {string} elementErrorText The error text to be shown for this specific element
   * @returns {JSX}
   */
  renderElement = (element, elementErrorText) => {
    const elementName = `${this.props.name}_${element.id}`;
    const elementValue = this.state.formData[element.id];
    const elementVisible = this.state.elementVisibility[element.id] || false;

    // Take a dynamic REACT element based on its type
    const Element = this.getFormElementComponent(element.type);
    if (!Element) {
      logger.error(`Unknown form element type: ${element.type}`);
      return null;
    }

    // Country and province elements have their data injected, if not already present
    const elementData = element;
    switch (element.type) {
      case ELEMENT_TYPE_COUNTRY: {
        elementData.options = element.options || this.countryList;
        break;
      }
      case ELEMENT_TYPE_PROVINCE: {
        // Province selection only makes sense with a country being selected, or from custom options
        const countryElement = this.formElements.find(el => el.type === ELEMENT_TYPE_COUNTRY);
        elementData.options =
          (countryElement && this.state.formData[countryElement.id]
            ? buildProvinceList(
              this.state.formData[countryElement.id],
              // Auto-select with "empty" when not required
              element.required ? null : emptySelectOption
            )
            : {}
          );
        break;
      }
      default: break;
    }

    return (
      <Element
        name={elementName}
        element={elementData}
        errorText={elementErrorText}
        value={elementValue}
        visible={elementVisible}
      />
    );
  };

  /**
   * Renders the component based on the given config
   * @return {JSX}
   */
  render() {
    // Convert validation errors for easier handling
    const validationErrors = buildValidationErrorList(this.props.validationErrors);

    return (
      <Form className={camelCase(this.props.name)} onSubmit={this.props.onSubmit}>
        <div className={this.props.className}>
          {this.formElements.map(element => (
            <Fragment key={`${this.props.name}_${element.id}`}>
              <Portal
                name={`${sanitize(this.props.name)}.${sanitize(element.id)}.${BEFORE}`}
              />
              <Portal name={`${sanitize(this.props.name)}.${sanitize(element.id)}`}>
                {this.renderElement(element, validationErrors[element.id] || '')}
              </Portal>
              <Portal
                name={`${sanitize(this.props.name)}.${sanitize(element.id)}.${AFTER}`}
              />
            </Fragment>
          ))}
        </div>
      </Form>
    );
  }
}

export default Builder;
