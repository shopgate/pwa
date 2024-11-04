import optInTrigger from './optInTrigger';
import optInTracking from './optInTracking';

export default (subscribe) => {
  optInTrigger(subscribe);
  optInTracking(subscribe);
};
