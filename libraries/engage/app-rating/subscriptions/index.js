import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import showModalAction from '@shopgate/pwa-common/actions/modal/showModal';
import { MODAL_PIPELINE_ERROR } from '@shopgate/pwa-common/constants/ModalTypes';
import event from '@shopgate/pwa-core/classes/Event';
import { incrementAppStartCount, resetAppStartCount } from '../action-creators/appStart';
import { incrementOrdersPlacedCount, resetOrdersPlacedCount } from '../action-creators/ordersPlaced';
import { incrementTimerCount, resetTimerCount } from '../action-creators/timer';
import { RULE_APP_STARTS, RULE_ORDERS_PLACED, RULE_TIMER } from '../constants';

// let timer;

/**
 * App rating subscriptions
 * @param {Function} subscribe The subscribe function
 */
export default function appRating(subscribe) {
  const {
    appRating: {
      appStarts,
      ordersPlaced,
      timeInterval,
    },
  } = appConfig;

  // even subscriber to handle app start ratings
  subscribe(appDidStart$, ({ dispatch, getState }) => {
    const { appRating: state } = getState();

    let mustShowModal = false;
    let hasRepeats = false;
    let incrementCountAction = null;
    let resetCountAction = null;

    switch (state.nextRule) {
      case RULE_APP_STARTS: {
        // app start count starts from 0
        mustShowModal = state.appStartCount === appStarts.value - 1;
        hasRepeats = appStarts.repeats === null || state.appStartResetCount < appStarts.repeats;

        incrementCountAction = incrementAppStartCount;
        resetCountAction = resetAppStartCount;
        break;
      }

      case RULE_TIMER: {
        // timer count starts from 0
        mustShowModal = state.timerCount === timeInterval.value - 1;
        hasRepeats = timeInterval.repeats === null ||
          state.timerResetCount < timeInterval.repeats;

        incrementCountAction = incrementTimerCount;
        resetCountAction = resetTimerCount;
        break;
      }

      case RULE_ORDERS_PLACED: {
        // orders placed count starts from 0
        mustShowModal = state.ordersPlacedCount === ordersPlaced.value - 1;
        hasRepeats = ordersPlaced.repeats === null ||
          state.ordersPlacedResetCount < ordersPlaced.repeats;

        incrementCountAction = incrementOrdersPlacedCount;
        resetCountAction = resetOrdersPlacedCount;

        break;
      }

      default:
        throw new Error(`rule ${state.nextRule} not defined`);
    }

    /**
     * initiate the events
     */
    const initCounts = () => {
      if (!mustShowModal && hasRepeats) {
        dispatch(incrementCountAction());
      }

      if (mustShowModal && hasRepeats) {
        dispatch(resetCountAction());

        // @INDICATOR: refactor
        dispatch(showModalAction({
          confirm: 'modal.ok',
          dismiss: null,
          title: 'test title',
          message: 'test message',
          type: MODAL_PIPELINE_ERROR,
          params: {},
        })).then(console.log);
      }
    };

    event.addCallback('checkoutSuccess', () => {
      initCounts();
    });
    initCounts();
  });
}
