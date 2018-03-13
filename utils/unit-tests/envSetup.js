
/* global jasmine */

require('jest-enzyme/lib/index');
const injectTapEventPlugin = require('react-tap-event-plugin');

injectTapEventPlugin();

global.SGEvent = {
  __call: () => {},
};

if (jasmine) {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
}
