import { PipelineRequest } from '../../core';

/**
 * pipeline call to shopgate.user.sendDefaultLocationCodeCode.v1
 * to set user default location in data base
 * @param {string} locationCode The location code to send to backend
 * @returns {Function} redux thunk
 */
const sendDefaultLocationCode = locationCode => () => new PipelineRequest('shopgate.user.setDefaultLocationCode')
  .setInput({ locationCode })
  .dispatch();

export default sendDefaultLocationCode;
