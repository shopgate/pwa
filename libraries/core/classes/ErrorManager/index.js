import EventEmitter from 'events';
import {
  DEFAULT_CONTEXT,
  SOURCE_PIPELINE,
  DEFAULT_SEVERITY,
} from '../../constants/ErrorManager';

export const emitter = new EventEmitter();

const pipelineVersionSuffix = /\.v\d+$/;

/**
 * The ErrorManager class.
 */
class ErrorManager {
  /**
   * Constructor.
   */
  constructor() {
    // Queue of errors that will be dispatched.
    this.errorQueue = new Map();

    // List of override message for specific errors.
    this.messages = {};

    // A variable to handle the intervals.
    this.timer = null;
  }

  /**
   * Gets a message by the given error.
   * @param {{ code: string, context: string, source: string }} error The error object.
   * @returns {string|null}
   */
  getMessage(error) {
    if (!this.validate(error)) {
      return null;
    }
    const { code, context = DEFAULT_CONTEXT, source } = error;

    const id = `${source}-${context}-${code}`;
    const unvId = `${source}-${context.replace(pipelineVersionSuffix, '')}-${code}`;
    const defaultId = `${source}-${DEFAULT_CONTEXT}-${code}`;

    let message = this.messages[id] || this.messages[unvId] || this.messages[defaultId] || null;

    if (typeof message === 'function') {
      message = message(error);
    }

    return message;
  }

  /**
   * Sets an override for a specific error message.
   * @param {Object} errorTemplate The error object.
   * @param {string} errorTemplate.code The error code.
   * @param {string} errorTemplate.context The context of the error, relative to the source..
   * @param {string} errorTemplate.message The default error message.
   * @param {string} [errorTemplate.source=SOURCE_PIPELINE] The source of the error.
   * @returns {ErrorManager}
   */
  setMessage(errorTemplate = {}) {
    const error = {
      source: SOURCE_PIPELINE,
      ...errorTemplate,
    };

    if (!this.validate(error)) {
      return this;
    }

    const { context = DEFAULT_CONTEXT } = error;
    const id = `${error.source}-${context}-${error.code}`;

    this.messages[id] = error.message;

    return this;
  }

  /**
   * Adds a new error object to the queue.
   * @param {Object} error The error object.
   * @param {string} error.code The error code.
   * @param {string} error.context The context of the error, relative to the source..
   * @param {string} error.message The default error message.
   * @param {string} error.source The source of the error.
   * @param {Object} error.meta Some meta data.
   */
  queue(error = {}) {
    if (!this.validate(error)) {
      return;
    }

    const {
      code,
      context = DEFAULT_CONTEXT,
      message,
      source,
      meta,
      severity = DEFAULT_SEVERITY,
    } = error;

    const id = `${source}-${context}-${code}`;
    const overrideMessage = this.getMessage(error) || message;
    this.errorQueue.set(id, {
      id,
      code,
      context,
      message: overrideMessage,
      meta: {
        ...meta,
        message,
      },
      source,
      severity,
    });

    if (!this.timer) {
      this.startTimer();
    }
  }

  /**
   * Calls dispatch() as an interval.
   */
  startTimer = async () => {
    await this.stopTimer();
    this.timer = setInterval(this.dispatch, 500);
  };

  /**
   * Clears the dispatch interval.
   */
  stopTimer = async () => {
    await clearInterval(this.timer);
    this.timer = null;
  };

  /**
   * Dispatched the stored error objects through the event emitter.
   * @returns {boolean}
   */
  dispatch = () => {
    if (this.errorQueue.size === 0) {
      return false;
    }
    this.errorQueue.forEach((error) => {
      emitter.emit(error.source, error);
    });

    this.stopTimer();
    this.errorQueue.clear();

    return true;
  };

  /**
   * Validates an error object.
   * @param {*} error The error object.
   * @returns {boolean}
   */
  validate = (error = {}) => {
    const { code = null, message = null, source = null } = error;

    if (!code || !message || !source) {
      return false;
    }

    if (typeof code !== 'string' || typeof source !== 'string') {
      return false;
    }

    return typeof message === 'string' || typeof message === 'function';
  }
}
/** @type {ErrorManager} */
export default new ErrorManager();
