import { createWorker } from 'redux-worker';
import reducer from './reducers';

const worker = createWorker();

worker.registerReducer(reducer);
