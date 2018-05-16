import {
  APP_ERROR,
  PIPELINE_ERROR,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched APP_ERROR action object.
 * @param {Object} error The error object.
 * @return {Object} The dispatched action object.
 */
export const appError = error => ({
  type: APP_ERROR,
  error,
});

/**
 * Creates the dispatched PIPELINE_ERROR action object.
 * @param {Object} error The error object.
 * @return {Object} The dispatched action object.
 */
export const pipelineError = error => ({
  type: PIPELINE_ERROR,
  error,
});

