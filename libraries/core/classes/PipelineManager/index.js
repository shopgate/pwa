/* eslint-disable */

import AppCommand from '../AppCommand';

/**
 * Manages the pipeline's requests and responses.
 */
class PipelineManager {
  constructor() {
    this.requests = new Map();
  }

  add(request) {
    const pipelineName = `${request.name}.v${request.version}`;
    request.createSerial(pipelineName);
    request.createEventCallbackName('pipelineResponse');
    this.requests.set(pipelineName, reqqest);
    return this.dispatch(pipelineName);
  }

  dispatch(pipelineName) {
    return new Promise((resolve, reject) => {
      const request = this.requests.get(pipelineName);
      request.initRequestCallback(resolve, reject);
      logGroup(`PipelineRequest %c${pipelineName}`, {input: request.input}, '#32ac5c');

      // Send the pipeline request.
      const command = new AppCommand();
      command.setCommandName('sendPipelineRequest');
      command.setLibVersion('12.0');
      command.dispatch({
        name: pipelineName,
        serial: request.serial,
        input: request.input,
        ...request.trusted && {type: 'trusted'},
      });
    });
  }
}

export default new PipelineManager();
