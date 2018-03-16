import RequestManager from '../RequestManager';
import {
  PROCESS_LAST_REQUEST,
  PROCESS_SEQUENTIALLY,
  PROPAGATE_REJECT,
} from '../../constants/RequestManagerModes';

const PIPELINE_REQUEST_TIMEOUT = 20000;

/**
 * Special request managers for pipelines.
 */
const cartModifyRequestManager = new RequestManager({
  processingMode: PROCESS_SEQUENTIALLY, // Order responses by request.
  timeout: PIPELINE_REQUEST_TIMEOUT,
});

const pipelineManagers = {
  'shopgate.cart.getCart': new RequestManager({
    processingMode: PROCESS_LAST_REQUEST, // Always use latest request.
    propagationMode: PROPAGATE_REJECT, // Reject outdated getCart() requests.
    timeout: PIPELINE_REQUEST_TIMEOUT,
  }),
  'shopgate.cart.addProducts': cartModifyRequestManager,
  'shopgate.cart.updateProducts': cartModifyRequestManager,
  'shopgate.cart.deleteProducts': cartModifyRequestManager,
  'shopgate.cart.addCoupons': cartModifyRequestManager,
  'shopgate.cart.deleteCoupons': cartModifyRequestManager,
};

const defaultManager = new RequestManager({ timeout: PIPELINE_REQUEST_TIMEOUT });

/**
 * Gets a request manager for the given pipeline or returns the default manager.
 * @param {string} name The name of the pipeline.
 * @returns {RequestManager} A pipeline manager for the given pipeline.
 */
export const getPipelineManager = (name) => {
  if (!pipelineManagers[name]) {
    return defaultManager;
  }

  return pipelineManagers[name];
};

/**
 * Add manager for pipeline.
 * @param {Object} manager The manager.
 * @param {string} pipeline The string identifier for the pipeline.
 */
export const addManagerForPipeline = (manager, pipeline) => {
  pipelineManagers[pipeline] = manager;
};
