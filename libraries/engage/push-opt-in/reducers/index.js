import { combineReducers } from 'redux';
import optInTrigger from './optInTrigger';
import optInModal from './optInModal';

export default combineReducers({
  optInTrigger,
  optInModal,
});
