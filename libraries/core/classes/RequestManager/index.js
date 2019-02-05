import { logger } from '../../helpers';
import {
  PROCESS_ANY,
  PROCESS_LAST_REQUEST,
  PROCESS_FIRST_RESPONSE,
  PROCESS_SEQUENTIALLY,
  PROCESS_ORDERED_REQUEST,
  PROPAGATE_REJECT,
  PROPAGATE_SINGLE,
} from '../../constants/RequestManagerModes';
import { EPIPELINERESPONSEREJECTED } from '../../constants/Pipeline';

/**
 * Creates an error object for requests that where rejected by the request manager.
 * @param {Object} queueItem The rejected request item from the request queue.
 * @return {Object}
 */
const createRejectedRequestErrorObject = (queueItem) => {
  const { request } = queueItem;

  return {
    code: EPIPELINERESPONSEREJECTED,
    message: `Response for ${request.name} with serial ${request.serial} rejected by the request manager.`,
  };
};

/**
 * Process only the latest request that has been sent.
 * This mode can either reject outdated requests or resolve them with the
 * response from the latest request.
 * @param {RequestManager} self The request manager instance.
 * @param {Request} request The request.
 * @param {Object} response The response.
 * @param {Function} resolve The resolve() callback of the request promise.
 */
const processLastRequest = (self, request, response, resolve) => {
  // Check if this is the most recent request.
  const lastQueueItem = self.requestQueue[self.requestQueue.length - 1];
  if (lastQueueItem && request.serial !== lastQueueItem.request.serial) {
    // This is not the correct response, so skip it.
    return;
  }

  // Remove the last request from the queue.
  self.requestQueue.pop();

  if (self.propagationMode === PROPAGATE_REJECT) {
    // Reject all the previous requests.
    self.requestQueue.forEach(item => item.reject(createRejectedRequestErrorObject(item)));

    if (self.requestQueue.length > 0) {
      logger.log(`RequestManager: rejected ${self.requestQueue.length} outdated request(s).`);
    }
  } else {
    // Resolve all the previous requests with the current response.
    self.requestQueue.forEach(item => item.resolve(response));
  }

  // Clear the request queue afterwards.
  const localSelf = self;
  localSelf.requestQueue = [];

  resolve(response);
};

/**
 * Process only the first response that was received and discard all other requests.
 * This mode can either reject superseded requests or resolve them with the first
 * received response.
 * @param {RequestManager} self The request manager instance.
 * @param {Request} request The request.
 * @param {Object} response The response.
 * @param {Function} resolve The resolve() callback of the request promise.
 */
const processFirstResponse = (self, request, response, resolve) => {
  if (self.propagationMode === PROPAGATE_REJECT) {
    // Reject all of the queued requests except for this one.
    self.requestQueue.forEach((item) => {
      if (item.request.serial !== request.serial) {
        item.reject(createRejectedRequestErrorObject(item));
      }
    });

    if (self.requestQueue.length - 1 > 0) {
      logger.log(`RequestManager: rejected ${self.requestQueue.length - 1} outdated request(s).`);
    }

    resolve(response);
  } else {
    // Resolve all of the previous requests with the current response.
    self.requestQueue.forEach(item => item.resolve(response));
  }

  // Clear the request queue afterwards.
  const localSelf = self;
  localSelf.requestQueue = [];
};

/**
 * This mode guarantees that responses are processed in the order of requests being sent.
 * No special propagation method is required.
 * @param {RequestManager} self The request manager instance.
 * @param {Request} request The request.
 * @param {Object} response The response.
 */
const processOrderedRequest = (self, request, response) => {
  const queuedRequest = self.requestQueue.find(item => item.request.serial === request.serial);
  queuedRequest.response = response;

  // Resolve the queued requests, as many as possible.
  let processedRequests = 0;
  const numQueuedEvents = self.requestQueue.length;

  while (self.requestQueue.length && self.requestQueue[0].response) {
    const nextRequest = self.requestQueue.shift();
    processedRequests += 1;
    nextRequest.resolve(nextRequest.response);
  }

  if (processedRequests > 0 && processedRequests < numQueuedEvents) {
    logger.log(`RequestManager: processed ${processedRequests}/${numQueuedEvents} request(s).`);
  }
};

/**
 * This mode will only allow one request at a time.
 * Multiple requests are queued and sent sequentially.
 * @param {RequestManager} self The request manager instance.
 * @param {Object} response The response.
 * @param {Function} resolve The resolve() callback of the request promise.
 */
const processSequentially = (self, response, resolve) => {
  resolve(response);

  self.requestQueue.shift();

  // Always dispatch one event at a time.
  if (self.requestQueue.length > 0) {
    const queueItem = self.requestQueue[0];

    // Dispatch the next queue item
    const localSelf = self;
    localSelf.pendingRequests += 1;

    queueItem.request.onDispatch(queueItem.resolve, queueItem.reject);
  }
};

/**
 * The request manager handles processing of requests and
 * propagation of received responses.
 */
class RequestManager {
  /**
   * Creates a new request manager.
   * @param {Object} options The options.
   * @param {string} options.processingMode The processing mode for this instance.
   * @param {string} options.propagationMode The propagation mode for queued requests.
   * @param {number|false} options.timeout Requests timeout duration.
   */
  constructor({
    processingMode = PROCESS_ANY,
    propagationMode = PROPAGATE_SINGLE,
    timeout = false,
  } = {}) {
    this.processingMode = processingMode;
    this.propagationMode = propagationMode;
    this.requestQueue = [];
    this.lastReceivedTime = 0;
    this.pendingRequests = 0;
    this.timeout = timeout;
    this.timers = [];
  }

  /**
   * Pushes a new request to the queue.
   * @param {Request} request The request.
   * @param {Function} resolve The resolve() callback of the request promise.
   * @param {Function} reject The reject() callback of the request promise.
   */
  enqueueRequest(request, resolve, reject) {
    // Get the current timestamp.
    const timestamp = this.currentTime;

    // Find the queue index position at the given timestamp.
    const index = this.requestQueue.findIndex(item => item.timestamp > timestamp);

    const item = {
      request,
      resolve,
      reject,
      timestamp,
      response: null,
    };

    if (index === -1) {
      // Not found, append to queue.
      this.requestQueue.push(item);
    } else {
      // Insert at the correct timestamp index.
      this.requestQueue.splice(index, 0, item);
    }
  }

  /**
   * Handles a new dispatch.
   * @param {Request} request The request.
   * @param {Function} resolve The resolve() callback of the request promise.
   * @param {Function} reject The reject() callback of the request promise.
   */
  handleDispatch(request, resolve, reject) {
    if (this.processingMode !== PROCESS_ANY) {
      // Enqueue this request if it requires special handling.
      this.enqueueRequest(request, resolve, reject);
    }

    if (this.processingMode === PROCESS_SEQUENTIALLY && this.pendingRequests > 0) {
      // Never dispatch more than a single request when running sequentially.
      return;
    }

    this.pendingRequests += 1;
    request.onDispatch(resolve, reject);

    if (this.timeout > 0) {
      this.timers[request.serial] = setTimeout(
        () => request.onTimeout(resolve, reject),
        this.timeout
      );
    }
  }

  /**
   * Handles an error that occurred during the request.
   * @param {Request} request The request this response belongs to.
   * @param {Function} reject The reject() callback of the request promise.
   * @param {Object} [message] The error object.
   */
  handleError(request, reject, message) {
    clearTimeout(this.timers[request.serial]);
    delete this.timers[request.serial];

    if (this.processingMode === PROCESS_ANY) {
      reject(message);
      return;
    }

    const index = this.requestQueue.findIndex(item => item.request.serial === request.serial);
    if (index >= 0) {
      this.pendingRequests -= 1;
      this.requestQueue.splice(index, 1);
      reject(message);
    }
  }

  /**
   * Handles a received response.
   * @param {Request} request The request this response belongs to.
   * @param {Function} resolve The resolve() callback of the request promise.
   * @param {Object} response The response.
   */
  handleResponse(request, resolve, response) {
    clearTimeout(this.timers[request.serial]);
    delete this.timers[request.serial];

    this.pendingRequests -= 1;

    switch (this.processingMode) {
      case PROCESS_LAST_REQUEST:
        processLastRequest(this, request, response, resolve);
        break;

      case PROCESS_FIRST_RESPONSE:
        processFirstResponse(this, request, response, resolve);
        break;

      case PROCESS_ORDERED_REQUEST:
        processOrderedRequest(this, request, response);
        break;

      case PROCESS_SEQUENTIALLY:
        processSequentially(this, response, resolve);
        break;

      default:
        // No special handling, just resolve the promise.
        resolve(response);
    }
  }

  /**
   * @return {number} The current unix timestamp.
   */
  get currentTime() { // eslint-disable-line class-methods-use-this
    return Date.now();
  }
}

export default RequestManager;
