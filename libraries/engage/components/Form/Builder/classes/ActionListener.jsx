import { logger } from '@shopgate/pwa-core/helpers';
import {
  ELEMENT_TYPE_NUMBER,
  ELEMENT_TYPE_COUNTRY,
  ELEMENT_TYPE_PROVINCE,
  ELEMENT_TYPE_CHECKBOX,
} from '../elementTypes';
import {
  ACTION_TYPE_UPDATE_PROVINCE_ELEMENT,
  ACTION_TYPE_SET_VISIBILITY,
  ACTION_TYPE_SET_VALUE,
  ACTION_TYPE_TRANSFORM,

  ACTION_SET_VALUE_FIXED,
  ACTION_SET_VALUE_COPY_FROM,
  ACTION_SET_VALUE_LENGTH_OF,

  ACTION_RULE_TYPE_NOT_IN,
  ACTION_RULE_TYPE_ONE_OF,
  ACTION_RULE_TYPE_BOOLEAN,
  ACTION_RULE_TYPE_REGEX,
  ACTION_RULE_DATA_TYPES,

  ACTION_RULES_CONCAT_METHOD_ALL,
  ACTION_RULES_CONCAT_METHOD_ANY,
  ACTION_RULES_CONCAT_METHOD_NONE,
} from './ActionListener.constants';

/**
 * ActionListener and handler for the FormBuilder component
 */
class ActionListener {
  /**
   * Constructor
   * @param {function(string)} getProvincesList Takes a country code and returns a list of provinces
   * @param {Object} defaults Form defaults
   */
  constructor(getProvincesList, defaults) {
    this.defaults = defaults;
    this.getProvincesList = getProvincesList;

    this.actionListeners = {};
  }

  /**
   * Takes the elements to be rendered by the FormBuilder and attaches available action listeners
   * to the component.
   * @param {FormElement[]} elementList List of all elements
   */
  attachAll = (elementList) => {
    // Attach action listeners for element (context) actions
    elementList.forEach((element) => {
      let elementActions = element.actions;
      if (element.type === ELEMENT_TYPE_PROVINCE) {
        elementActions = elementActions || [];

        // Requires a country element to create a "update provinces" action
        const countryElement = elementList.find(el => el.type === ELEMENT_TYPE_COUNTRY);
        if (countryElement) {
          // Attach new action, which is always triggered, when the (only) country element changes
          elementActions.push({
            type: ACTION_TYPE_UPDATE_PROVINCE_ELEMENT,
            rules: [{ context: countryElement.id }],
          });
        }
      }

      if (elementActions === undefined) {
        return;
      }

      // Create listeners for all supported actions
      elementActions.forEach((action) => {
        const actionRules = action.rules || [];
        // Always apply action to itself if no rules given
        if (actionRules.length === 0) {
          // Define a basic rule if no rules given
          actionRules.push({ context: element.id });
        }

        // Actions do have a fixed structure which needs to be fulfilled
        const normalizedAction = {
          ...action,
          rules: actionRules,
        };

        // Assign the action listeners to all contexts of the current element
        actionRules.forEach((rule) => {
          this.attach(element, normalizedAction, rule);
        });
      });
    });
  }

  /**
   * Attaches one or possibly multiple action listeners for the given rule
   * @param {FormElement} element The current element that is modified by the action
   * @param {FormFieldAction} action The action and it's params
   * @param {FormFieldActionRule} rule The rule to check in case the action listener is triggered
   */
  attach = (element, action, rule) => {
    let actionListener;
    switch (action.type) {
      case ACTION_TYPE_UPDATE_PROVINCE_ELEMENT: {
        actionListener = this.createUpdateProvinceElementHandler(element, action);
        break;
      }
      case ACTION_TYPE_SET_VISIBILITY: {
        // Visibility is special and uses the result of the evaluation itself
        actionListener = this.createSetVisibilityHandler(element, action);
        break;
      }
      case ACTION_TYPE_SET_VALUE: {
        actionListener = this.createEvaluatedHandler(
          element,
          action,
          this.createSetValueHandler(element, action)
        );
        break;
      }
      case ACTION_TYPE_TRANSFORM: {
        actionListener = this.createEvaluatedHandler(
          element,
          action,
          this.createTransformHandler(element, action)
        );
        break;
      }
      default: return;
    }

    this.register(rule.context, actionListener);
  }

  /**
   * Action listener creator to check all related rules before calling any further action listeners
   * @param {FormElement} element The element for which the listener should be created for
   * @param {FormFieldAction} action The action to be create a listener for
   * @param {Function} actionListener The action listener to call if the rule applies
   * @returns {Function} Returns a function to modify and return the modified state.
   */
  createEvaluatedHandler = (element, action, actionListener) => (prevState, nextState) => {
    // Apply rules before accepting any changes
    if (!this.evaluateRules(element, action, nextState)) {
      return nextState;
    }

    return actionListener(prevState, nextState);
  }

  /**
   * Action listener creator to handle "updateCountryChange" action
   * @param {FormElement} provinceEl The element for which the listener should be created for
   * @param {FormFieldAction} action The action to be create a listener for
   * @returns {Function} Returns a function to modify and return the modified state.
   */
  createUpdateProvinceElementHandler = (provinceEl, action) => (prevState, nextState) => {
    const countryElementId = action.rules[0].context;
    const countryValue = nextState.formData[countryElementId];
    const countryDefault = this.defaults[countryElementId];

    const newState = { ...nextState };

    // Overwrite province with the form's default, if country matches the default as well
    if (countryValue === countryDefault) {
      newState.formData[provinceEl.id] = this.defaults[provinceEl.id];
    } else {
      // Update province to first or no selection, based on "required" attribute
      newState.formData[provinceEl.id] = !provinceEl.required
        ? ''
        : Object.keys(this.getProvincesList(countryValue))[0];
    }
    return newState;
  }

  /**
   * Action listener creator to handle "setVisibility" actions
   * @param {FormElement} element The element for which the listener should be created for
   * @param {FormFieldAction} action The action to be create a listener for
   * @returns {Function} Returns a function to modify and return the modified state.
   */
  createSetVisibilityHandler = (element, action) => (prevState, nextState) => {
    let newState = {
      ...nextState,
      elementVisibility: {
        ...nextState.elementVisibility,
        [element.id]: this.evaluateRules(element, action, nextState),
      },
      // Copy form data to be able to check changes and all follow up actions
      formData: {
        ...nextState.formData,
      },
    };

    if (newState.formData[element.id] === undefined &&
      newState.elementVisibility[element.id]) {
      newState.formData[element.id] = this.defaults[element.id];
    } else if (!newState.elementVisibility[element.id] &&
      newState.formData[element.id] !== undefined) {
      delete newState.formData[element.id];
    }

    // Notify follow up listeners about the current change
    if (nextState.formData[element.id] !== newState.formData[element.id]) {
      newState = this.notify(element.id, prevState, newState);
    }

    return newState;
  }

  /**
   * Action listener creator to handle "setValue" actions
   * @param {FormElement} element The element for which the listener should be created for
   * @param {FormFieldAction} action The action to be create a listener for
   * @returns {Function} Returns the modified state.
   */
  createSetValueHandler = (element, action) => (prevState, nextState) => {
    if (typeof action.params !== 'object' || Array.isArray(action.params)) {
      logger.error(`Error: Invalid or missing form action in element '${element.id}'. ` +
        'Params must be in the format: { "type": string, "value": string }');
      return nextState;
    }

    let { value } = action.params;

    // Check correctness of value data type
    switch (typeof value) {
      case 'boolean':
        if (element.type !== ELEMENT_TYPE_CHECKBOX) {
          logger.error(`Error: Invalid form action param in element '${element.id}'. ` +
            `Allowed '${ELEMENT_TYPE_CHECKBOX}' data type for 'params.value' is: 'boolean'`);
          return nextState;
        }
        break;
      case 'number':
        if (element.type !== ELEMENT_TYPE_NUMBER) {
          logger.error(`Error: Invalid form action param in element '${element.id}'. ` +
            `Allowed '${ELEMENT_TYPE_NUMBER}' data types for 'params.value' are: ` +
            "'number' and 'string'");
          return nextState;
        }
        break;
      case 'string':
        if (element.type === ELEMENT_TYPE_CHECKBOX) {
          logger.error(`Error: Invalid form action param in element '${element.id}'. ` +
            `Allowed '${ELEMENT_TYPE_CHECKBOX}' data type for 'params.value' is: 'boolean'`);
          return nextState;
        }
        break;
      default:
        logger.error(`Error: Invalid form action param in element '${element.id}'. ` +
          `Can not use '${typeof value}' data for elements of type '${element.type}'`);
        return nextState;
    }

    // Perform action based on "setValue" type, defined in params
    switch (action.params.type) {
      case ACTION_SET_VALUE_LENGTH_OF:
        value = `${nextState.formData[action.params.value].length}`;
        break;
      case ACTION_SET_VALUE_COPY_FROM:
        value = nextState.formData[action.params.value];
        break;
      case undefined:
      case ACTION_SET_VALUE_FIXED:
        break;
      default:
        logger.error(`Error: Invalid form action param 'type' in element '${element.id}'. ` +
          `Allowed param types are: '${ACTION_SET_VALUE_LENGTH_OF}', ` +
          `'${ACTION_SET_VALUE_COPY_FROM}', '${ACTION_SET_VALUE_FIXED}'`);
        return nextState;
    }

    let newState = {
      ...nextState,
      formData: {
        ...nextState.formData,
        [element.id]: value,
      },
    };

    // Notify follow up listeners about the current change, if there are any changes
    if (nextState.formData[element.id] !== value) {
      newState = this.notify(element.id, prevState, newState);
    }

    return newState;
  }

  /**
   * Action listener creator to handle "transform" actions
   * @param {FormElement} element The element for which the listener should be created for
   * @param {FormFieldAction} action The action to be create a listener for
   * @returns {Function} Returns a function to modify and return the modified state.
   */
  createTransformHandler = (element, action) => (prevState, nextState) => {
    /**
     * Takes a string and applies a case function on it
     * @param {string|boolean|number} subject The subject to be transformed
     * @returns {string|boolean|number}
     */
    const transform = (subject) => {
      // Get optional params to be applied in the transformation process
      let args = action.params.value || [];
      if (Array.isArray(action.params.value)) {
        args = action.params.value;
      }

      switch (typeof subject) {
        case 'string': {
          if (typeof String.prototype[action.params.type] !== 'function' &&
            typeof String[action.params.type] !== 'function'
          ) {
            logger.error("Error: Invalid transform function passed to actions 'params.type' " +
              `attribute in element '${element.id}'. Must be withing 'String.prototype'!`);
            return subject;
          }

          if (typeof String.prototype[action.params.type] === 'function') {
            return String.prototype[action.params.type].apply(subject, args);
          }
          return String[action.params.type](subject);
        }
        case 'boolean': {
          if (typeof Boolean.prototype[action.params.type] !== 'function' &&
            typeof Boolean[action.params.type] !== 'function'
          ) {
            logger.error("Error: Invalid transform function passed to actions 'params.type' " +
              `attribute in element '${element.id}'. Must be withing 'String.prototype'!`);
            return subject;
          }

          if (typeof Boolean.prototype[action.params.type] === 'function') {
            return Boolean.prototype[action.params.type].apply(subject, args);
          }
          return Boolean[action.params.type](subject);
        }
        case 'number': {
          if (typeof Number.prototype[action.params.type] !== 'function' &&
            typeof Number[action.params.type] !== 'function'
          ) {
            logger.error("Error: Invalid transform function passed to actions 'params.type' " +
              `attribute in element '${element.id}'. Must be withing 'String.prototype'!`);
            return subject;
          }

          if (typeof Number.prototype[action.params.type] === 'function') {
            return Number.prototype[action.params.type].apply(subject, args);
          }
          return Number[action.params.type](subject);
        }

        default:
          logger.error("Error: The given data can not be transformed. Must be of type 'string', "
           + "'boolean' or 'number'");
          return subject;
      }
    };

    let newState = {
      ...nextState,
      formData: {
        ...nextState.formData,
        [element.id]: transform(nextState.formData[element.id]),
      },
    };

    // Notify follow up listeners about the current change
    if (nextState.formData[element.id] !== newState.formData[element.id]) {
      newState = this.notify(element.id, prevState, newState);
    }

    return newState;
  }

  /**
   * Evaluates all action rules of a given element action
   *
   * @param {FormElement} element The element of which the action rules should be evaluated
   * @param {FormFieldAction} action The current action to be evaluate rules for
   * @param {Object} nextState The state at the time before the "action" event finished
   * @returns {boolean}
   */
  evaluateRules = (element, action, nextState) => {
    const concatRules = this.createConcatMethod(action.ruleConcatMethod);
    const resultInitValue = action.ruleConcatMethod !== ACTION_RULES_CONCAT_METHOD_ANY;

    let result = resultInitValue;
    action.rules.forEach((rule) => {
      let tmpResult = resultInitValue;
      let ruleType = rule.type;
      let ruleData = rule.data;

      // Default to rule type "boolean" and data true when type not given
      if (ruleType === undefined) {
        ruleType = ACTION_RULE_TYPE_BOOLEAN;
        ruleData = true;
      }

      // Check rule validity
      if (!ACTION_RULE_DATA_TYPES[ruleType]) {
        logger.error(`Error: Unknown action rule type '${ruleType}'in element '${element.id}'`);
        return;
      }
      // Check type of ruleData
      const ruleDataType = ACTION_RULE_DATA_TYPES[ruleType];
      if (ruleDataType === 'array' && !Array.isArray(ruleData)) {
        logger.error(`Error: Invalid FormBuilder action rule in element '${element.id}': ` +
          `data must be an 'array' for rule type '${ruleType}'`);
        return;
      }
      // eslint-disable-next-line valid-typeof
      if (ruleDataType !== 'array' && typeof ruleData !== ruleDataType) {
        logger.error(`Error: Invalid FormBuilder action rule in element '${element.id}': ` +
          `data must be '${ruleDataType}' for rule type '${ruleType}'`);
        return;
      }

      switch (ruleType) {
        case ACTION_RULE_TYPE_ONE_OF: {
          tmpResult = ruleData.includes(nextState.formData[rule.context]);
          break;
        }
        case ACTION_RULE_TYPE_NOT_IN: {
          tmpResult = !ruleData.includes(nextState.formData[rule.context]);
          break;
        }
        case ACTION_RULE_TYPE_BOOLEAN: {
          tmpResult = ruleData;
          break;
        }
        case ACTION_RULE_TYPE_REGEX: {
          const regexParts = ruleData.split('/');
          let regexPattern = '';
          let regexParam = '';
          if (regexParts.length === 1) {
            [regexPattern] = regexParts;
          } else if (regexParts.length === 3) {
            regexParts.shift();
            [regexPattern, regexParam = ''] = regexParts;
          } else {
            logger.error(`Error: Invalid regex string in action rule in element ${element.id}`);
            break;
          }

          const regex = new RegExp(regexPattern, regexParam);
          tmpResult = regex.test(nextState.formData[rule.context]);
          break;
        }
        default: break;
      }

      // Concat rules based on the rule concat method of the action
      result = concatRules(result, tmpResult);
    });

    return result;
  }

  /**
   * Creates a concat function that defines how to concatenate action rule results
   *
   * @param {string} method The method defined by the action
   * @returns {Function}
   */
  createConcatMethod = method => (prev, next) => {
    switch (method) {
      case ACTION_RULES_CONCAT_METHOD_NONE: return prev && !next;
      case ACTION_RULES_CONCAT_METHOD_ANY: return prev || next;
      case ACTION_RULES_CONCAT_METHOD_ALL:
      default:
        return prev && next;
    }
  }

  /**
   * Adds a "action" listener to a given context element
   *
   * @param {string} elementId the element to listen for
   * @param {Function} handler The listener to call when something has changed
   */
  register = (elementId, handler) => {
    if (!this.actionListeners[elementId]) {
      this.actionListeners[elementId] = [];
    }
    this.actionListeners[elementId].push(handler);
  }

  /**
   * Takes an element id, the state to work with and optional data and notifies all "action"
   * listeners about the change. Every listener can manipulate the state.
   * Returns the new state.
   *
   * @param {string} elementId The id of the element that was changed
   * @param {Object} prevState The state before any changes took place
   * @param {Object} nextState The state containing all updates before the listeners are executed
   * @returns {Object} The new state after all handlers have been executed.
   */
  notify = (elementId, prevState, nextState) => {
    let newState = nextState;
    if (this.actionListeners[elementId]) {
      this.actionListeners[elementId].forEach((notifyListener) => {
        // Note: The order of state changes is applied in the same order of listener registration
        newState = notifyListener(prevState, newState);
      });
    }
    return newState;
  }
}

export default ActionListener;
