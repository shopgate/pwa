import {
  APP_ERROR,
  PIPELINE_ERROR,
} from '../constants/ActionTypes';
import { main$ } from './main';

/**
 * Gets triggered when an app error is received.
 * @type {Observable}
 */
export const appError$ = main$
  .filter(({ action }) => action.type === APP_ERROR);

/**
 * Gets triggered when an pipeline error is received.
 * @type {Observable}
 */
export const pipelineError$ = main$
  .filter(({ action }) => action.type === PIPELINE_ERROR);
