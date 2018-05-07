import RequestManager from '../RequestManager';
import {
  PROCESS_LAST_REQUEST,
  PROCESS_SEQUENTIALLY,
  PROPAGATE_REJECT,
} from '../../constants/RequestManagerModes';
import * as pipelines from '../../constants/Pipeline';

const PIPELINE_REQUEST_TIMEOUT = 20000;

/**
 * Special request managers for pipelines.
 */
const cartModifyRequestManager = new RequestManager({
  processingMode: PROCESS_SEQUENTIALLY, // Order responses by request.
  timeout: PIPELINE_REQUEST_TIMEOUT,
});

const pipelineManagers = {
  [pipelines.SHOPGATE_CART_GET_CART]: new RequestManager({
    processingMode: PROCESS_LAST_REQUEST, // Always use latest request.
    propagationMode: PROPAGATE_REJECT, // Reject outdated getCart() requests.
    timeout: PIPELINE_REQUEST_TIMEOUT,
  }),
  [pipelines.SHOPGATE_CART_ADD_PRODUCTS]: cartModifyRequestManager,
  [pipelines.SHOPGATE_CART_UPDATE_PRODUCTS]: cartModifyRequestManager,
  [pipelines.SHOPGATE_CART_DELETE_PRODUCTS]: cartModifyRequestManager,
  [pipelines.SHOPGATE_CART_ADD_COUPONS]: cartModifyRequestManager,
  [pipelines.SHOPGATE_CART_DELETE_COUPONS]: cartModifyRequestManager,
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
