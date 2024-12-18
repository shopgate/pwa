import { PipelineRequest } from '../../core';

/**
 * pipeline call to shopgate.user.setDefaultLocationCode.v1
 * to set user default location in data base
 * @param {Object} locationCode The location code to send to backend
 * @returns {Object} dispatches the request with the locationCode as input
 */
const setDefaultLocation = locationCode => new PipelineRequest('shopgate.user.setDefaultLocationCode')
  .setInput({ locationCode })
  .dispatch();

export default setDefaultLocation;
