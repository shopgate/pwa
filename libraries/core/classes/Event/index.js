import EventEmitter from 'events';
import {
  APP_EVENT_GET_APP_PERMISSIONS_RESPONSE,
  APP_EVENT_REQUEST_APP_PERMISSIONS_RESPONSE,
} from '../../constants/AppEvents';
import { logger } from '../../helpers';

const HANDLER_ADD = 'add';
const HANDLER_REMOVE = 'remove';

/**
 * Event class.
 */
class Event extends EventEmitter {
  /**
   * Constructor.
   */
  constructor() {
    super();

    this.setMaxListeners(20);

    /**
     * A global implementation of the call function to make it accessible to the app.
     *
     * We have to check here if there is already a __call from the cake2 project present.
     * This could happen because we use the tracking-core in the cake2 project.
     */
    // eslint-disable-next-line no-underscore-dangle
    const legacy = window.SGEvent.__call;

    if (typeof legacy !== 'function') {
    // eslint-disable-next-line no-underscore-dangle
      window.SGEvent.__call = this.call.bind(this);
    } else {
    // eslint-disable-next-line no-underscore-dangle
      window.SGEvent.__call = (...args) => {
        legacy(...args);
        this.call(...args);
      };
    }
  }

  /**
   * Registers a callback function for one or multiple events.
   * @param {string} events A single event or multiple events separated by comma.
   * @param {Function} callback The callback function.
   */
  addCallback(events, callback) {
    this.handleCallbacks(HANDLER_ADD, events, callback);
  }

  /**
   * De-registers a callback function for one or multiple events.
   * @param {string} events A single event or multiple events separated by comma.
   * @param {Function} callback The callback function.
   */
  removeCallback(events, callback) {
    this.handleCallbacks(HANDLER_REMOVE, events, callback);
  }

  /**
   * Handles the register and de-register of a callback.
   * @param {string} type What type of action should be performed.
   * @param {string} events A single event or multiple events separated by comma.
   * @param {Function} callback The callback function.
   */
  handleCallbacks(type, events, callback) {
    const eventNames = events.split(',');

    eventNames.forEach((event) => {
      switch (type) {
        case HANDLER_ADD:
          this.addListener(event, callback);
          break;
        case HANDLER_REMOVE:
          this.removeListener(event, callback);
          break;
        default:
          break;
      }
    });
  }

  /**
   * Triggers an event.
   * @param {string} event The event name.
   * @param {Object} params Custom parameters for the event.
   */
  trigger(event, params = null) {
    setTimeout(() => this.emit(event, params), 0);
  }

  /**
   * This function will be called by the app to trigger events.
   * @param {string} event The event name.
   * @param {Array} [parameters=[]] The event parameters.
   */
  call(event, parameters = []) {
    let eventName = event;

    /**
     * Some system events relate to request commands.
     * When these commands were fired, a serial was created in order
     * to identify an appropriate callback event.
     * To identify these callbacks, the serial has to be decoded from the parameter list.
     */
    if ([
      'pipelineResponse',
      'httpResponse',
    ].includes(event)) {
      eventName += `:${parameters[1]}`;
    } else if ([
      'dataResponse',
      'webStorageResponse',
      APP_EVENT_GET_APP_PERMISSIONS_RESPONSE,
      APP_EVENT_REQUEST_APP_PERMISSIONS_RESPONSE,
    ].includes(event)) {
      eventName += `:${parameters[0]}`;
    }

    const calledEvent = this.emit(eventName, ...parameters);

    if (!calledEvent) {
      logger.warn(`Attempt to call unknown event: ${eventName}`);
    }
  }
}

// TODO:
// We need this as a temporary solution because of double node_modules form extensions and theme.
if (!window.TmpEventInstance) {
  window.TmpEventInstance = new Event();
}

export default window.TmpEventInstance;
