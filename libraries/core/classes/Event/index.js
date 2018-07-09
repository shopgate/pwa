import EventEmitter from 'events';
import registerEvents from '../../commands/registerEvents';
import { EVENT_KEYBOARD_WILL_CHANGE } from '../../constants/Keyboard';
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

    // Two array for lookups are faster than one object.
    // https://jsperf.com/object-hasownproperty-vs-includes-vs-indexof/1
    /**
     * Collection of event names which must be registered to the app from webview.
     * @type {Array}
     */
    this.registerableEvents = [EVENT_KEYBOARD_WILL_CHANGE];
    /**
     * Collection of event names which are already registered to the app.
     * @type {Array}
     */
    this.registeredEvents = [];
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
          this.registerAppEvent(event);
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
   * Checks if event should be registered and registers.
   * @param {string} event Event name.
   */
  registerAppEvent(event) {
    if (!this.registerableEvents.includes(event)) {
      // Event is not meant to be registered to the app
      return;
    }
    if (this.registeredEvents.includes(event)) {
      // Already registered
      return;
    }

    registerEvents([event]);
    this.registeredEvents.push(event);
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
      'getAppPermissionsResponse',
      'requestAppPermissionsResponse',
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
