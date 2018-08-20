import { createWorker } from '@virtuous/redux-web-worker';
import reducer from './reducers';

const worker = createWorker();

worker.registerReducer(reducer);
