import { MESSAGE_TYPE_ERROR } from '../constants';

/**
 * Checks if the messages array of a pipeline response contains error messages.
 * @param {Array} [messages=[]] The messages.
 * @return {boolean}
 */
export const messagesHaveErrors = (messages = []) =>
  messages.some(({ type }) => type === MESSAGE_TYPE_ERROR);

/**
 * Creates an error message list which can be processes by the error system.
 * @param {string} pipeline The related pipeline.
 * @param {Array} messages The messages.
 * @return {Array}
 */
export const createErrorMessageList = (pipeline, messages) => messages.map(message => ({
  ...message,
  context: pipeline,
}));
