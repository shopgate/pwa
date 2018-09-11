import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import Portal from '@shopgate/pwa-common/components/Portal';
import Form from '@shopgate/pwa-ui-shared/Form';
import * as portals from '@shopgate/user/constants/Portals';
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
import iso3166 from './iso-3166-2';

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
  }

  static defaultProps = {
    defaults: {},
    className: '',
    onSubmit: () => {},
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
      errors: {},
    };

    this.emptySelection = {
      key: '',
      label: '',
    };

    // Reorganize form elements into a strucure that can be easily rendered
    const formElements = this.buildFormElements(props.config);
    const formDefaults = this.buildFormDefaults(formElements);

    this.actionListener = new ActionListener(this.getProvincesList, formDefaults);
    this.actionListener.attachAll(formElements);

    // Sort the elements after attaching action listeners to keep action hierarchy same as creation
    this.formElements = formElements.sort(this.elementSortFunc);

    // Assemble combined country/province list based on the config element
    const countryElement = this.formElements.find(el => el.type === ELEMENT_TYPE_COUNTRY);
    if (countryElement) {
      // Check validity of the country element options list "countries"
      if (typeof countryElement.countries === 'object' &&
        !Array.isArray(countryElement.countries)) {
        logger.error("Error: Invalid property type 'countries' in element " +
          `'${countryElement.id}'. Must be 'array', 'null' or 'undefined'`);
      } else {
        // Build country display list for the country element (whitelist)
        // For 'null', 'undefined' and '[]' it shows all countries
        let countryKeys;
        if (countryElement.countries && countryElement.countries.length > 0) {
          countryKeys = countryElement.countries;
        } else {
          countryKeys = Object.keys(iso3166);
        }
        this.countryList = countryKeys.reduce((reducer, countryCode) => ({
          ...reducer,
          [countryCode]: iso3166[countryCode].name,
        }), {});

        // Add a "no selection" element
        if (!countryElement.required) {
          this.countryList = {
            [this.emptySelection.key]: this.emptySelection.label,
            ...this.countryList,
          };
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
   * Returns a list of provinces based on the given country id
   *
   * @param {string} countryCode Country code of the country to fetch provinces from
   * @return {Object}
   */
  getProvincesList = (countryCode) => {
    if (!iso3166) {
      return {};
    }

    let provinceList = {};
    const provinceElement = this.formElements.find(el => el.type === ELEMENT_TYPE_PROVINCE);
    if (provinceElement) {
      /** @property {iso3166} divisions */
      provinceList = iso3166[countryCode] ? iso3166[countryCode].divisions : {};
      if (!provinceElement.required) {
        provinceList = {
          [this.emptySelection.key]: this.emptySelection.label,
          ...provinceList,
        };
      }
    }
    return provinceList;
  }

  /**
   * Takes a list of which elements to render based on the respective element type
   *
   * @param {Form} formConfig Configuration of which form fields to render
   * @return {FormElement[]}
   */
  buildFormElements = (formConfig) => {
    /**
     * @type {FormElement[]}
     */
    let elementList = [];

    let hasCountryElement = false;
    let hasProvinceElement = false;

    /**
     * @param {string} id id
     * @param {AnyFormField} field field
     * @param {boolean} custom custom
     */
    const addFormElement = (id, field, custom) => {
      // The "custom" field is just a placeholder for more fields
      if (id === 'custom') {
        return;
      }

      // Make sure country and province elements are only added once
      if (field.type === ELEMENT_TYPE_COUNTRY) {
        if (hasCountryElement) {
          logger.error(`Error: Can not add multiple elements of type '${field.type}'`);
          return;
        }
        hasCountryElement = true;
      }
      if (field.type === ELEMENT_TYPE_PROVINCE) {
        if (hasProvinceElement) {
          logger.error(`Error: Can not add multiple elements of type '${field.type}'`);
          return;
        }
        hasProvinceElement = true;
      }

      elementList.push({
        id,
        ...field,
        custom,
      });
    };

    // Add all non-custom attributes and mark them as such
    Object.keys(formConfig.fields).forEach((id) => {
      addFormElement(id, formConfig.fields[id], false);
    });

    // Add custom fields to the element list
    if (formConfig.fields.custom) {
      Object.keys(formConfig.fields.custom).forEach((id) => {
        addFormElement(id, formConfig.fields.custom[id], true);
      });
    }

    // Generate handler functions for each element
    elementList = elementList.map(element => ({
      ...element,
      handleChange: this.createElementChangeHandler(element),
    }));

    // Handle fixed visibilities
    elementList.forEach((element) => {
      // Assume as visible except it's explicitly set to "false"
      this.state.elementVisibility[element.id] = element.visible !== false;
    });

    return elementList;
  }

  /**
   * @param {Object} formElements form elements
   * @returns {Object}
   */
  buildFormDefaults = (formElements) => {
    const formDefaults = {};

    // Take only those defaults from props, that are actually represented by an element
    formElements.forEach((element) => {
      let defaultState = null;

      // Use default from element config as a base
      if (element.default !== undefined) {
        defaultState = element.default;
      }

      // Take defaults from "customAttributes" property or from the higher level, based on element
      if (element.custom && this.props.defaults.customAttributes !== undefined) {
        if (this.props.defaults.customAttributes[element.id] !== undefined) {
          defaultState = this.props.defaults.customAttributes[element.id];
        }
      } else if (!element.custom && this.props.defaults[element.id] !== undefined) {
        defaultState = this.props.defaults[element.id];
      }

      // Save default into the form state and into defaults property if one was set
      if (defaultState !== undefined) {
        this.state.formData[element.id] = defaultState;
        formDefaults[element.id] = defaultState;
      }
    });

    return formDefaults;
  }

  /**
   * Takes an element and generates a change handler based on it's type,
   * @param {Object} element Element to create the handler for
   * @returns {function}
   */
  createElementChangeHandler = element => (value) => {
    // Apply value change to new state
    const newState = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [element.id]: value,
      },
    };

    // Handle context sensitive functionality by via "action" listener and use the "new" state
    const updatedState = this.actionListener.notify(element.id, this.state, newState);

    // TODO: handle validation errors and set "hasErrors" accordingly - only "requred" check, yet
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
    this.props.handleUpdate(updateData, hasErrors);
  };

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
    // Keep relative sort order when no specific sort order was set for both
    if (element2.sortOrder === undefined) {
      return -1;
    } else if (element1.sortOrder === undefined) {
      return 1;
    }

    // Sort in ascending order of sortOrder otherwise
    return element1.sortOrder - element2.sortOrder;
  };

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
          ? this.getProvincesList(this.state.formData[countryElement.id])
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
    /**
     * Takes a string and converts it to a part to be used in a portal name
     * @param {string} s The string to be sanitized
     * @return {string}
     */
    function sanitize(s) {
      return s.replace(/[\\._]/, '-');
    }

    return (
      <Fragment>
        <Form onSubmit={this.props.onSubmit}>
          <div className={this.props.className}>
            {this.formElements.map(element => (
              <Fragment key={`${this.props.name}.${element.id}`}>
                <Portal
                  name={`${sanitize(this.props.name)}.${sanitize(element.id)}.${portals.BEFORE}`}
                />
                <Portal name={`${sanitize(this.props.name)}.${sanitize(element.id)}`}>
                  { this.renderElement(element) }
                </Portal>
                <Portal
                  name={`${sanitize(this.props.name)}.${sanitize(element.id)}.${portals.AFTER}`}
                />
              </Fragment>
            ))}
          </div>
        </Form>
      </Fragment>
    );
  }
}

export { Builder };
